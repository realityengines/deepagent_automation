const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const libre = require('libreoffice-convert');
const { promisify } = require('util');
require('dotenv/config');

// Promisify the libreoffice-convert function
const libreConvert = promisify(libre.convert);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Common validation for all verification functions
 */
function validateInputs(prompt, filePath) {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
  
  if (!filePath || filePath.trim().length === 0) {
    throw new Error('File path cannot be empty');
  }
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
}

/**
 * Verifies an image file against a prompt
 * @param {string} prompt - The verification prompt
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} - Verification results
 */
async function verifyImage(prompt, imagePath) {
  validateInputs(prompt, imagePath);
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = getMimeType(path.extname(imagePath));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert image analysis specialist. Analyze images with precision and provide structured verification results.

ANALYSIS REQUIREMENTS:
- Examine all visual elements: objects, text, colors, composition, style, quality
- Count and describe every visual component accurately
- Evaluate how well the image matches the given prompt/requirements
- Provide relevance scoring from 0-100 based on prompt fulfillment
- Be thorough, objective, and specific in descriptions

RESPONSE FORMAT (JSON only):
{
  "relevanceScore": <0-100 integer>,
  "imageCount": 1,
  "imageDescriptions": ["<detailed comprehensive description>"],
}

SCORING CRITERIA:
90-100: Perfect match, exceeds expectations
80-89: Excellent match, minor gaps
70-79: Good match, some missing elements
60-69: Partial match, significant issues
50-59: Poor match, major problems
0-49: Does not fulfill prompt requirements`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `VERIFICATION PROMPT: "${prompt}"

Analyze this image thoroughly and provide detailed verification results in the specified JSON format.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ]
      }
    ],
    max_tokens: 1500
  });

  return parseResponse(response.choices[0].message.content || '');
}

/**
 * Verifies a PDF file against a prompt
 * @param {string} prompt - The verification prompt
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Object>} - Verification results
 */
async function verifyPDF(prompt, pdfPath) {
  validateInputs(prompt, pdfPath);

  try {
    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert document analysis specialist. Analyze PDF document content with precision and provide structured verification results.

ANALYSIS REQUIREMENTS:
- Analyze the PDF document content thoroughly based on available text
- **IMPORTANT**: You are analyzing TEXT EXTRACTED from a PDF - visual elements (images, charts, diagrams) may exist in the original PDF but are NOT visible in this text extraction
- Based on the text content, infer and estimate likely visual elements when there are clear textual indicators
- Look for explicit text references to visual elements (e.g., "Figure 1", "Chart shows", "Image depicts", "See diagram", "Table 1", "Illustration", etc.)
- **VISUAL ELEMENT ESTIMATION**: Only estimate visual elements when there are:
  * Clear textual references to visuals
  * Document types that commonly contain visuals (technical reports, academic papers, children's books, manuals, etc.)
  * Content structure suggesting visual support (data presentation, step-by-step guides, etc.)
- **CORRUPTION DETECTION**: Look for text indicators of corrupted/broken content such as:
  * References to missing images or broken links
  * Error messages in the text
  * Incomplete sentences or garbled text that might indicate corruption
- **RELEVANCE SCORING**: Focus primarily on content relevance to the prompt
- Evaluate how well the text content and subject matter match the verification requirements
- Do NOT penalize relevance scores solely for lack of detectable visual elements, as they may exist in the original PDF but be invisible in text extraction
- Score relevance from 0-100 based on how well the CONTENT matches prompt requirements

RESPONSE FORMAT (JSON only):
{
  "relevanceScore": <0-100 integer based on content relevance to the prompt>,
  "imageCount": <estimated count based on explicit text references or reasonable document type indicators>,
  "imageDescriptions": ["<descriptions based on text references or reasonable estimates for document type>"],
  "corruptedImages": <count of corrupted/broken content indicators>,
  "summary": "<comprehensive analysis focusing on content relevance, noting that visual elements may exist but aren't visible in text extraction>"
}

SCORING CRITERIA (Content-Focused):
90-100: Excellent content match for the prompt requirements
80-89: Good content match with minor gaps
70-79: Adequate content match, covers main aspects
60-69: Partial content match, some relevant information
50-59: Limited content match, minimal relevance
0-49: Content does not match prompt requirements`
        },
        {
          role: "user",
          content: `VERIFICATION PROMPT: "${prompt}"

PDF CONTENT (TEXT EXTRACTED):
${pdfText.substring(0, 15000)} ${pdfText.length > 15000 ? '...[content truncated]' : ''}

IMPORTANT CONTEXT: This is TEXT EXTRACTED from a PDF document. Visual elements (images, illustrations, charts, diagrams, etc.) that may exist in the original PDF are NOT visible in this text extraction.

Please analyze the content relevance based on the text content and subject matter. Estimate visual elements only when there are clear textual indicators or the document type commonly includes visuals.

Analyze this PDF document content and provide detailed verification results in the specified JSON format. Focus on content relevance to the prompt.`
        }
      ],
      max_tokens: 2000
    });

    return parseResponse(response.choices[0].message.content || '');

  } catch (error) {
    console.error('Error processing PDF file:', error.message);
    return {
      relevanceScore: 0,
      imageCount: 0,
      imageDescriptions: [`Failed to process PDF file: ${error.message}`],
      corruptedImages: 0,
      summary: `PDF processing failed. Error: ${error.message}`
    };
  }
}

/**
 * Verifies a PowerPoint file against a prompt
 * @param {string} prompt - The verification prompt
 * @param {string} pptPath - Path to the PowerPoint file
 * @returns {Promise<Object>} - Verification results
 */
async function verifyPowerPoint(prompt, pptPath) {
  validateInputs(prompt, pptPath);

  try {
    // Read the PowerPoint file
    const pptBuffer = fs.readFileSync(pptPath);

    // Convert PowerPoint to PDF using LibreOffice
    console.log('Converting PowerPoint to PDF...');
    const pdfBuffer = await libreConvert(pptBuffer, '.pdf', undefined);

    // Extract text from the converted PDF
    console.log('Extracting text from converted PDF...');
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error('No text content found in converted PowerPoint');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert presentation analysis specialist. Analyze PowerPoint presentation content with precision and provide structured verification results.

ANALYSIS REQUIREMENTS:
- Analyze the PowerPoint presentation content thoroughly
- Based on the text content, infer and count likely visual elements across all slides: images, charts, tables, graphs, figures, photos, diagrams, illustrations, slide layouts
- Look for text references to visual elements (e.g., "Slide 1", "Chart shows", "Image depicts", bullet points, titles, etc.)
- Consider typical presentation structure: title slides, content slides, conclusion slides
- **CORRUPTION DETECTION**: Look for text indicators of corrupted/broken content such as:
  * References to missing images or broken links in slides
  * Error messages in the presentation text
  * Incomplete sentences or garbled text that might indicate corruption
  * Missing slide content or formatting issues
- Evaluate content relevance against the verification prompt
- Assess presentation structure, flow, and messaging
- Score relevance from 0-100 based on how well content matches prompt requirements

RESPONSE FORMAT (JSON only):
{
  "relevanceScore": <0-100 integer>,
  "imageCount": <estimated count of visual elements based on text references and typical presentation structure>,
  "imageDescriptions": ["<description of visual elements and slides mentioned in text>"],
  "corruptedImages": <count of corrupted/broken content indicators>,
  "summary": "<comprehensive analysis of presentation relevance and structure>"
}

SCORING CRITERIA:
90-100: Perfect presentation match, comprehensive coverage of topic
80-89: Excellent match, minor content gaps or missing elements
70-79: Good match, some relevant slides/sections missing
60-69: Partial match, significant presentation content issues
50-59: Poor match, limited relevant presentation content
0-49: Does not fulfill prompt requirements or irrelevant content`
        },
        {
          role: "user",
          content: `VERIFICATION PROMPT: "${prompt}"

POWERPOINT CONTENT:
${pdfText.substring(0, 15000)} ${pdfText.length > 15000 ? '...[content truncated]' : ''}

Analyze this PowerPoint presentation content and provide detailed verification results in the specified JSON format. Estimate visual elements based on text references and typical presentation structure, and check for any indicators of corrupted content.`
        }
      ],
      max_tokens: 2000
    });

    return parseResponse(response.choices[0].message.content || '');

  } catch (error) {
    console.error('Error processing PowerPoint file:', error.message);

    // Fallback response if conversion fails
    return {
      relevanceScore: 0,
      imageCount: 0,
      imageDescriptions: [`Failed to process PowerPoint file: ${error.message}. Ensure LibreOffice is installed on the system.`],
      corruptedImages: 0,
      summary: `PowerPoint processing failed. Error: ${error.message}. This typically requires LibreOffice to be installed for file conversion.`
    };
  }
}

/**
 * Simple response parser
 * @param {string} content - Response content from OpenAI
 * @returns {Object} - Parsed result
 */
function parseResponse(content) {
  try {
    // Try to find JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        relevanceScore: Number(parsed.relevanceScore) || 0,
        imageCount: Number(parsed.imageCount) || 0,
        imageDescriptions: Array.isArray(parsed.imageDescriptions) ? parsed.imageDescriptions : [],
        corruptedImages: Number(parsed.corruptedImages) || 0,
        summary: parsed.summary || 'No summary provided'
      };
    }
  } catch (error) {
    console.warn('Failed to parse response:', error.message);
  }
  
  // Fallback response
  return {
    relevanceScore: 0,
    imageCount: 0,
    imageDescriptions: ['Failed to parse response'],
    corruptedImages: 0,
    summary: content.substring(0, 200)
  };
}

/**
 * Gets MIME type for image files
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
function getMimeType(extension) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
}

module.exports = {
  verifyImage,
  verifyPDF,
  verifyPowerPoint
};