import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const checkATS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 📄 Read PDF
    const data = new Uint8Array(fs.readFileSync(req.file.path));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ");
    }

    text = text.toLowerCase();

    let score = 0;

    // 🔹 1. Keywords (weighted)
    const techKeywords = ["javascript","react","node","python","java","mongodb","sql","aws","docker","api"];
    const nonTechKeywords = ["management","sales","marketing","communication","leadership","strategy","analytics","excel"];

    const techMatches = techKeywords.filter(k => text.includes(k));
    const nonTechMatches = nonTechKeywords.filter(k => text.includes(k));

    const keywordScore =
      ((techMatches.length * 2 + nonTechMatches.length) /
        (techKeywords.length * 2 + nonTechKeywords.length)) * 30;

    score += keywordScore;

    // 🔹 2. Sections
    const sections = ["education","experience","skills","projects","certifications","summary"];
    const foundSections = sections.filter(s => text.includes(s));
    const sectionScore = (foundSections.length / sections.length) * 20;

    score += sectionScore;

    // 🔹 3. Impact (numbers)
    const hasNumbers = /\d+%|\d+x|\d+ years|\d+\+/.test(text);
    const impactScore = hasNumbers ? 15 : 5;

    score += impactScore;

    // 🔹 4. Length
    const wordCount = text.split(/\s+/).length;
    const lengthScore = wordCount > 300 ? 10 : wordCount > 150 ? 7 : 3;

    score += lengthScore;

    // 🔹 5. Readability (basic)
    const sentenceCount = text.split(/[.!?]/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    let readabilityScore = 5;
    if (avgWordsPerSentence > 25) readabilityScore = 2;
    if (avgWordsPerSentence < 8) readabilityScore = 3;

    score += readabilityScore;

    // 🔹 6. Action Verbs (VERY IMPORTANT 🔥)
    const actionVerbs = [
      "developed","created","managed","led","designed","implemented",
      "improved","increased","optimized","built","analyzed"
    ];

    const actionMatches = actionVerbs.filter(v => text.includes(v));
    const actionScore = (actionMatches.length / actionVerbs.length) * 10;

    score += actionScore;

    // 🔹 7. Duplicate word penalty
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    const duplicationRatio = uniqueWords.size / words.length;

    if (duplicationRatio < 0.5) {
      score -= 5; // penalty
    }

    // 🔹 8. Role Detection
    const roleDetected = techMatches.length >= nonTechMatches.length ? "Tech" : "Non-Tech";

    // 🔹 9. Missing Keywords
    const allKeywords = [...techKeywords, ...nonTechKeywords];
    const missingKeywords = allKeywords.filter(k => !text.includes(k)).slice(0, 8);

    // 🔹 10. Suggestions (SMART)
    let suggestions = [];

    if (techMatches.length + nonTechMatches.length < 5) {
      suggestions.push("Add more relevant keywords based on job description");
    }

    if (foundSections.length < 4) {
      suggestions.push("Include sections like Projects, Certifications, Skills");
    }

    if (!hasNumbers) {
      suggestions.push("Add measurable achievements (e.g. increased sales by 30%)");
    }

    if (wordCount < 200) {
      suggestions.push("Resume is too short, add more detailed experience");
    }

    if (actionMatches.length < 3) {
      suggestions.push("Use action verbs like 'Developed', 'Led', 'Optimized'");
    }

    if (duplicationRatio < 0.6) {
      suggestions.push("Reduce repetition of words and improve vocabulary");
    }

    // 🧹 Delete file
    fs.unlinkSync(req.file.path);

    // 🔥 FINAL SCORE FIX
    score = Math.max(0, Math.min(100, score));
    const finalScore = Math.round(score);

    // 🎯 Grade system (as you asked)
    let grade = "";
    let message = "";

    if (finalScore < 50) {
      grade = "Bad";
      message = "❌ Your resume needs major improvement";
    } else if (finalScore < 70) {
      grade = "Average";
      message = "⚠️ Your resume is average, improve it";
    } else if (finalScore < 90) {
      grade = "Good";
      message = "✅ Good resume, but can be improved";
    } else {
      grade = "Excellent";
      message = "🔥 Excellent ATS-friendly resume";
    }

    // 📤 RESPONSE
    res.json({
      atsScore: finalScore,
      grade,
      message,
      roleDetected,

      breakdown: {
        keywords: Math.round(keywordScore),
        sections: Math.round(sectionScore),
        impact: impactScore,
        length: lengthScore,
        readability: readabilityScore,
        action: Math.round(actionScore)
      },

      foundSections,
      missingKeywords,
      suggestions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};