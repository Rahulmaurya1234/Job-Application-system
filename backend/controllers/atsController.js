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
      const strings = content.items.map(item => item.str);
      text += strings.join(" ");
    }

    text = text.toLowerCase();

    // 🔥 ATS LOGIC START
    let score = 0;

    // 🔹 1. Keywords (Tech + Non-Tech)
    const techKeywords = [
      "javascript","react","node","python","java","mongodb","sql","aws","docker","api"
    ];

    const nonTechKeywords = [
      "management","sales","marketing","communication","leadership","strategy","analytics","excel"
    ];

    const allKeywords = [...techKeywords, ...nonTechKeywords];

    const matchedKeywords = allKeywords.filter(k => text.includes(k));
    const keywordScore = (matchedKeywords.length / allKeywords.length) * 40;

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
    const lengthScore = wordCount > 300 ? 10 : 5;

    score += lengthScore;

    // 🔹 5. Readability
    const readabilityScore = text.length > 1000 ? 5 : 2;

    score += readabilityScore;

    // 🔹 6. Role Detection
    const techMatches = techKeywords.filter(k => text.includes(k)).length;
    const nonTechMatches = nonTechKeywords.filter(k => text.includes(k)).length;

    const roleDetected = techMatches >= nonTechMatches ? "Tech" : "Non-Tech";

    // 🔹 7. Missing Keywords
    const missingKeywords = allKeywords
      .filter(k => !text.includes(k))
      .slice(0, 6);

    // 🔹 8. Suggestions
    let suggestions = [];

    if (matchedKeywords.length < 5) {
      suggestions.push("Add more job-relevant keywords");
    }

    if (foundSections.length < 4) {
      suggestions.push("Include sections like Projects, Skills, Certifications");
    }

    if (!hasNumbers) {
      suggestions.push("Add measurable achievements (e.g. increased sales by 30%)");
    }

    if (wordCount < 200) {
      suggestions.push("Resume is too short, add more content");
    }

    // 🧹 Delete uploaded file
    fs.unlinkSync(req.file.path);

    // 📤 FINAL RESPONSE
    res.json({
      atsScore: Math.round(score),
      roleDetected,

      breakdown: {
        keywords: Math.round(keywordScore),
        sections: Math.round(sectionScore),
        impact: impactScore,
        length: lengthScore,
        readability: readabilityScore
      },

      foundSections,
      missingKeywords,
      suggestions,

      message:
        score > 80
          ? "Excellent ATS Resume 🚀"
          : score > 60
          ? "Good Resume 👍"
          : "Needs Improvement ❌"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};