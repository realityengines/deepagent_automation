import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { getResults } from './simpleResultCollector.js';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = 'gpt-4o';
const API_URL = 'https://api.openai.com/v1/chat/completions';

const DEFAULT_INPUT_FILE = path.join('jsonReport', 'SerachDeepAgentjsonReport.json');
const DEFAULT_OUTPUT_FILE = path.join('llm-judge', 'results', 'evaluated-results.json');
const DEFAULT_SUMMARY_FILE = path.join('llm-judge', 'results', 'evaluation-summary.json');

/**
 * Judge a single autocomplete suggestion
 * @param {string} systemprompt
 * @param {string} userprompt
 * @param {string|string[]} search
 * @returns {Promise<Object>}
 */
async function judgeAutocomplete(promptSearch, followUpQuery, search) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in environment variables");
  }

  const formattedSearch = Array.isArray(search)
    ? search.map((item, index) => `Search Result ${index + 1}:\n${item}\n`).join('\n')
    : search;

  const prompt = `
Context Searched:
\`\`\`
${promptSearch}
\`\`\`

${followUpQuery}
\`\`\`

Autocomplete suggestion:
\`\`\`
${formattedSearch}
\`\`\`

Rate this searched result suggestion with a SINGLE score out of 10, considering the following criteria:
- Correctness (Is the information accurate and error-free?)
- Relevance (Does it closely match the intent of the search prompt?)
- Completeness (Does it provide a full and helpful answer?)
- Best practices (does it follow good coding style?)

Provide ONLY your score and a one-line explanation in this exact JSON format:
{
  "score": 8,
  "explanation": "Your one-line explanation here"
}
`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a Searched reviewer evaluating autocomplete suggestions. Respond with valid JSON only containing a score (0-10) and brief explanation."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    try {
      return JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse judge response");
    }
  } catch (error) {
    console.error("Judge failed:", error.message);
    return {
      score: 0,
      explanation: `Error: ${error.message}`
    };
  }
}

/**
 * Main function to run the judge on all collected results
 */
async function runJudge() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || DEFAULT_INPUT_FILE;
  const outputFile = args[1] || DEFAULT_OUTPUT_FILE;
  const summaryFile = args[2] || DEFAULT_SUMMARY_FILE;

  try {
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = getResults(inputFile);

    if (!results || results.length === 0) {
      console.error(`No results found in ${inputFile}`);
      process.exit(1);
    }

    console.log(`Found ${results.length} test results to evaluate`);

    const evaluations = [];

    for (let i = 0; i < results.length; i++) {
      const { systemprompt, userprompt, search, prompt } = results[i];
      const testName = prompt || userprompt || "Test " + (i + 1);

      console.log(`[${i + 1}/${results.length}] Evaluating ${testName}...`);

      const evaluation = await judgeAutocomplete(systemprompt, userprompt, search);

      evaluations.push({
        testName,
        evaluation
      });

      if (i < results.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    fs.writeFileSync(outputFile, JSON.stringify(evaluations, null, 2), 'utf8');
    console.log(`Evaluations saved to ${outputFile}`);

    const summary = generateGitHubSummary(evaluations);
    fs.writeFileSync(summaryFile, summary, 'utf8');
    console.log(`Summary saved to ${summaryFile}`);

    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
      console.log("Added results to GitHub Actions summary");
    } else {
      console.log("GitHub Actions summary environment not detected");
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generate a GitHub-friendly markdown summary
 * @param {Array} evaluations
 * @returns {string}
 */
function generateGitHubSummary(evaluations) {
  let totalScore = 0;
  let count = 0;

  evaluations.forEach(item => {
    if (item.evaluation && typeof item.evaluation.score === 'number') {
      totalScore += item.evaluation.score;
      count++;
    }
  });

  const avgScore = count > 0 ? (totalScore / count).toFixed(2) : 'N/A';

  let markdown = `## Autocomplete Evaluation Summary\n\n`;
  markdown += `**Total tests evaluated:** ${count}\n`;
  markdown += `**Average score:** ${avgScore}/10\n\n`;

  markdown += `### Individual Results\n\n`;
  markdown += `| Test | Score | Explanation |\n`;
  markdown += `| ---- | ----- | ----------- |\n`;

  evaluations.forEach(item => {
    const score = item.evaluation.score;
    const explanation = item.evaluation.explanation;
    markdown += `| ${item.testName} | ${score}/10 | ${explanation} |\n`;
  });

  return markdown;
}

// ✅ FIXED ENTRY POINT: Just run it directly
runJudge();

export { judgeAutocomplete, runJudge };
