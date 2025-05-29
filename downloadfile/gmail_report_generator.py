#!/usr/bin/env python3
"""
Gmail Activity Report Generator
Creates a comprehensive PDF report from Gmail email data
"""

import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import pytz
from collections import Counter
import re
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import io
import base64

# Set style for plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class GmailReportGenerator:
    def __init__(self, json_file_path):
        self.json_file_path = json_file_path
        self.emails = []
        self.df = None
        self.load_data()
        
    def load_data(self):
        """Load and parse email data from JSON file"""
        with open(self.json_file_path, 'r', encoding='utf-8') as f:
            self.emails = json.load(f)
        
        # Convert to DataFrame for easier analysis
        self.df = pd.DataFrame(self.emails)
        
        # Parse timestamps with UTC handling
        self.df['parsed_time'] = pd.to_datetime(self.df['received_time'], errors='coerce', utc=True)
        
        # Handle any remaining NaT values by trying alternative parsing
        mask = self.df['parsed_time'].isna()
        if mask.any():
            # Try parsing without UTC for problematic entries
            self.df.loc[mask, 'parsed_time'] = pd.to_datetime(
                self.df.loc[mask, 'received_time'], 
                errors='coerce'
            )
        
        # Extract hour for time analysis (handle timezone conversion safely)
        try:
            self.df['hour'] = self.df['parsed_time'].dt.tz_convert('US/Eastern').dt.hour
        except:
            # Fallback: just use the hour without timezone conversion
            self.df['hour'] = self.df['parsed_time'].dt.hour
        
        # Clean sender names
        self.df['clean_sender'] = self.df['sender_name'].apply(self.clean_sender_name)
        
    def clean_sender_name(self, sender):
        """Clean sender names for better display"""
        if pd.isna(sender):
            return "Unknown"
        
        # Remove email addresses and extra characters
        sender = re.sub(r'<.*?>', '', sender)
        sender = re.sub(r'"', '', sender)
        sender = sender.strip()
        
        if not sender:
            return "Unknown"
        
        return sender
    
    def analyze_senders(self):
        """Analyze email senders"""
        sender_counts = self.df['clean_sender'].value_counts()
        return sender_counts
    
    def analyze_topics(self):
        """Analyze email topics and themes"""
        subjects = self.df['subject'].tolist()
        
        # Common keywords analysis
        all_words = []
        for subject in subjects:
            if pd.notna(subject):
                words = re.findall(r'\b[A-Za-z]{3,}\b', subject.lower())
                all_words.extend(words)
        
        # Filter out common words
        stop_words = {'the', 'and', 'for', 'are', 'with', 'this', 'that', 'from', 'you', 'your'}
        filtered_words = [word for word in all_words if word not in stop_words]
        
        word_counts = Counter(filtered_words)
        return word_counts.most_common(10)
    
    def analyze_time_patterns(self):
        """Analyze time-based patterns"""
        hourly_counts = self.df['hour'].value_counts().sort_index()
        return hourly_counts
    
    def identify_key_emails(self):
        """Identify key emails based on content and importance"""
        key_emails = []
        
        for _, email in self.df.iterrows():
            # Check for important keywords
            subject = str(email['subject']).lower()
            content = str(email['content_preview']).lower()
            
            importance_keywords = ['urgent', 'important', 'critical', 'high priority', 'failed', 'error']
            
            if any(keyword in subject or keyword in content for keyword in importance_keywords):
                key_emails.append({
                    'subject': email['subject'],
                    'sender': email['clean_sender'],
                    'time': email['received_time'],
                    'reason': 'Contains important keywords'
                })
        
        return key_emails
    
    def create_visualizations(self):
        """Create charts and save them as images"""
        # Create figure with subplots
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Email volume over time (hourly)
        hourly_counts = self.analyze_time_patterns()
        ax1.bar(hourly_counts.index, hourly_counts.values, color='skyblue', alpha=0.7)
        ax1.set_title('Email Volume by Hour', fontsize=14, fontweight='bold')
        ax1.set_xlabel('Hour of Day')
        ax1.set_ylabel('Number of Emails')
        ax1.grid(True, alpha=0.3)
        
        # 2. Sender distribution
        sender_counts = self.analyze_senders()
        top_senders = sender_counts.head(8)
        ax2.pie(top_senders.values, labels=top_senders.index, autopct='%1.1f%%', startangle=90)
        ax2.set_title('Email Distribution by Sender', fontsize=14, fontweight='bold')
        
        # 3. Top keywords in subjects
        topics = self.analyze_topics()
        if topics:
            words, counts = zip(*topics[:8])
            ax3.barh(words, counts, color='lightcoral', alpha=0.7)
            ax3.set_title('Most Common Keywords in Subjects', fontsize=14, fontweight='bold')
            ax3.set_xlabel('Frequency')
        
        # 4. Email timeline
        timeline_data = self.df.groupby(self.df['parsed_time'].dt.date).size()
        ax4.plot(timeline_data.index, timeline_data.values, marker='o', linewidth=2, markersize=6)
        ax4.set_title('Email Timeline', fontsize=14, fontweight='bold')
        ax4.set_xlabel('Date')
        ax4.set_ylabel('Number of Emails')
        ax4.tick_params(axis='x', rotation=45)
        ax4.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('/home/ubuntu/email_analysis_charts.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        return '/home/ubuntu/email_analysis_charts.png'
    
    def generate_pdf_report(self, output_path):
        """Generate comprehensive PDF report"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue
        )
        
        # Title
        story.append(Paragraph("Gmail Activity Report - Last 8 Hours", title_style))
        story.append(Spacer(1, 20))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        
        total_emails = len(self.emails)
        time_range = f"{self.df['parsed_time'].min().strftime('%Y-%m-%d %H:%M')} to {self.df['parsed_time'].max().strftime('%Y-%m-%d %H:%M')}"
        unique_senders = self.df['clean_sender'].nunique()
        
        summary_text = f"""
        <b>Report Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}<br/>
        <b>Analysis Period:</b> {time_range}<br/>
        <b>Total Emails Analyzed:</b> {total_emails}<br/>
        <b>Unique Senders:</b> {unique_senders}<br/>
        <b>Average Emails per Hour:</b> {total_emails/8:.1f}<br/><br/>
        
        This report provides a comprehensive analysis of Gmail activity over the last 8 hours, 
        including sender patterns, content themes, and temporal distribution of email traffic.
        """
        
        story.append(Paragraph(summary_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Sender Analysis
        story.append(Paragraph("Sender Analysis", heading_style))
        
        sender_counts = self.analyze_senders()
        sender_table_data = [['Sender', 'Email Count', 'Percentage']]
        
        for sender, count in sender_counts.head(10).items():
            percentage = (count / total_emails) * 100
            sender_table_data.append([sender, str(count), f"{percentage:.1f}%"])
        
        sender_table = Table(sender_table_data)
        sender_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(sender_table)
        story.append(Spacer(1, 20))
        
        # Email Topics and Themes
        story.append(Paragraph("Email Topics and Themes", heading_style))
        
        topics = self.analyze_topics()
        if topics:
            topics_text = "Most frequently mentioned keywords in email subjects:<br/><br/>"
            for word, count in topics:
                topics_text += f"• <b>{word.title()}</b>: {count} occurrences<br/>"
        else:
            topics_text = "No significant keyword patterns identified."
        
        story.append(Paragraph(topics_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Time-based Activity Patterns
        story.append(Paragraph("Time-based Activity Patterns", heading_style))
        
        hourly_counts = self.analyze_time_patterns()
        peak_hour = hourly_counts.idxmax()
        peak_count = hourly_counts.max()
        
        time_analysis_text = f"""
        <b>Peak Activity Hour:</b> {peak_hour}:00 ({peak_count} emails)<br/>
        <b>Activity Distribution:</b><br/>
        """
        
        for hour in sorted(hourly_counts.index):
            count = hourly_counts[hour]
            time_analysis_text += f"• {hour:02d}:00 - {count} emails<br/>"
        
        story.append(Paragraph(time_analysis_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Key Emails Analysis
        story.append(Paragraph("Content Analysis - Key Emails", heading_style))
        
        key_emails = self.identify_key_emails()
        if key_emails:
            key_emails_text = "Important emails identified based on content analysis:<br/><br/>"
            for email in key_emails:
                key_emails_text += f"• <b>{email['subject']}</b><br/>"
                key_emails_text += f"  From: {email['sender']} | Time: {email['time']}<br/>"
                key_emails_text += f"  Reason: {email['reason']}<br/><br/>"
        else:
            key_emails_text = "No emails flagged as high priority based on content analysis."
        
        story.append(Paragraph(key_emails_text, styles['Normal']))
        story.append(PageBreak())
        
        # Visual Charts
        story.append(Paragraph("Visual Analysis", heading_style))
        chart_path = self.create_visualizations()
        
        if chart_path:
            story.append(Image(chart_path, width=7*inch, height=5.6*inch))
        
        story.append(PageBreak())
        
        # Detailed Appendix
        story.append(Paragraph("Detailed Appendix - All Emails", heading_style))
        
        appendix_table_data = [['#', 'Subject', 'Sender', 'Received Time']]
        
        for i, email in enumerate(self.emails, 1):
            subject = email['subject'][:50] + "..." if len(email['subject']) > 50 else email['subject']
            sender = email['sender_name'][:30] + "..." if len(email['sender_name']) > 30 else email['sender_name']
            time_str = email['received_time']
            
            appendix_table_data.append([str(i), subject, sender, time_str])
        
        appendix_table = Table(appendix_table_data, colWidths=[0.5*inch, 3*inch, 2*inch, 2*inch])
        appendix_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        
        story.append(appendix_table)
        
        # Build PDF
        doc.build(story)
        print(f"Report generated successfully: {output_path}")

def main():
    # Generate the report
    generator = GmailReportGenerator('/home/ubuntu/gmail_emails_8hours.json')
    generator.generate_pdf_report('/home/ubuntu/gmail_activity_report.pdf')

if __name__ == "__main__":
    main()
