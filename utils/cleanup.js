import fs from 'fs';
import path from 'path';

export const cleanupDirectories = () => {
    const directories = ['downloadfile','jsonReport','llm-judge/results', 'urlData'];
    const files = ['urlData/conversation_urls.txt'];
    
    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        
        if (fs.existsSync(dirPath)) {
            // Delete all files in directory
            try {
                fs.readdirSync(dirPath).forEach(file => {
                    const filePath = path.join(dirPath, file);
                    fs.unlinkSync(filePath);
                    console.log(`Deleted file: ${filePath}`);
                });
                console.log(`Cleaned ${dir} directory`);
            } catch (error) {
                console.log(`Error cleaning ${dir} directory: ${error.message}`);
            }
        } else {
            // Create directory if it doesn't exist
            try {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created ${dir} directory`);
            } catch (error) {
                console.log(`Error creating ${dir} directory: ${error.message}`);
            }
        }
    });
    
    files.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            } else {
                // Create the file if it doesn't exist to avoid future errors
                fs.writeFileSync(filePath, '', 'utf8');
                console.log(`Created file: ${filePath}`);
            }
        } catch (error) {
            console.log(`Error handling file ${filePath}: ${error.message}`);
        }
    });
};