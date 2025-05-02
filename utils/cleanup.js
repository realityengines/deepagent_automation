import fs from 'fs';
import path from 'path';

export const cleanupDirectories = () => {
    // const directories = ['downlaodfile', 'jsonReport'];
    const directories = ['downlaodfile','jsonReport','llm-judge/results'];
    
    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        
        if (fs.existsSync(dirPath)) {
            // Delete all files in directory
            fs.readdirSync(dirPath).forEach(file => {
                const filePath = path.join(dirPath, file);
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            });
            console.log(`Cleaned ${dir} directory`);
        } else {
            // Create directory if it doesn't exist
            fs.mkdirSync(dirPath);
            console.log(`Created ${dir} directory`);
        }
    });
};