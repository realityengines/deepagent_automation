import fs from 'fs';
import path from 'path';

// Update default results location to llm-judge/results folder
const DEFAULT_RESULTS_FILE = path.join('jsonReport', 'SerachDeepAgentjsonReport.json');

/**
 * Save a test result to the JSON file
 * @param {string} systemprompt - Name of the system promapt 
 * @param {string} userprompt - The send user qauery
 * @param {string} search - The searched result 
 * @param {string} [filePath] - Optional custom file path
 */
function saveResult(systemprompt, userprompt, search, filePath = DEFAULT_RESULTS_FILE) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create results object
    const result = {
      systemprompt,
      userprompt,
      search,
      timestamp: new Date().toISOString()
    };
    
    // Load existing results if file exists
    let results = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      results = JSON.parse(data);
    }
    
    // Add new result
    results.push(result);
    
    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Result saved for test "${systemprompt}" to ${filePath}`);
    
  } catch (error) {
    console.error(`Error saving result: ${error.message}`);
  }
}

/**
 * Clear all results from the JSON file
 * @param {string} [filePath] - Optional custom file path
 */
function clearResults(filePath = DEFAULT_RESULTS_FILE) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    console.log(`Results cleared in ${filePath}`);
  } catch (error) {
    console.error(`Error clearing results: ${error.message}`);
  }
}

/**
 * Get all results from the JSON file
 * @param {string} [filePath] - Optional custom file path
 * @returns {Array} Array of test results
 */
function getResults(filePath = DEFAULT_RESULTS_FILE) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error getting results: ${error.message}`);
    return [];
  }
}

export { saveResult, clearResults, getResults }; 