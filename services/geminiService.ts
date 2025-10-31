
import { GoogleGenAI, Type } from "@google/genai";
import type { StudentData, PredictionResult, HistoricalEntry, ChatMessage, Flashcard, SessionState, SessionResource, UserProfile, StudySessionSetup, PlannerInput, StudyTask, QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getPerformancePrediction(data: StudentData, userProfile: UserProfile): Promise<PredictionResult> {
  const prompt = `
    You are an expert AI academic advisor. Your task is to predict a student's final performance score based on several academic and behavioral parameters and provide a comprehensive, actionable analysis that is HYPER-PERSONALIZED to their specific context.

    Student's Parameters:
    - Attendance: ${data.attendance}%
    - Average Assignment Score: ${data.assignmentScore}%
    - Average Quiz Score: ${data.quizScore}%
    - Midterm Exam Score: ${data.midtermScore}%
    - Class Participation: ${data.participationScore}%
    - Daily Study Hours: ${data.studyHours}
    - Weekly Extracurricular Hours: ${data.extracurricularHours}
    - Previous GPA: ${data.previousGPA} out of 4.0
    - In-class Attentiveness: ${data.classAttentiveness}%
    - Homework Completion Rate: ${data.homeworkCompletion}%

    Student's Personal Context:
    - Courses: ${userProfile.courses.length > 0 ? userProfile.courses.map(c => c.name).join(', ') : 'Not specified'}
    - Preferred Learning Style: ${userProfile.learningStyle || 'Not specified'}

    Based on all of this information, provide a JSON object with the following structure. Do not include any other text, explanations, or markdown formatting outside of the JSON structure.

    - predictedScore: A numerical score from 0 to 100.
    - performanceLevel: A string categorizing performance ('Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement').
    - recommendations: An array of 3 concise, personalized, actionable recommendation strings. Tailor them to the student's courses if possible. Start each with a relevant emoji.
    - strengths: An array of 2 key strengths based on the student's data.
    - weaknesses: An array of 2 key areas for improvement based on the student's data.
    - subjectBreakdown: An array of 4 objects, using the student's actual courses if provided. If not, infer subjects (e.g., 'Mathematics', 'Science'). Each object has a 'subject' and a predicted 'score' (0-100).
    - suggestedResources: An array of 3 objects, each with a 'title', a 'type', and a placeholder 'url' ('#'). CRITICALLY, these resources MUST align with the student's stated Learning Style. For example, suggest videos/diagrams for 'Visual' learners, podcasts/lectures for 'Auditory' learners, interactive projects for 'Kinesthetic' learners, and articles/textbooks for 'Reading/Writing' learners.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedScore: { type: Type.NUMBER },
            performanceLevel: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            weaknesses: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            subjectBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                },
                required: ["subject", "score"]
              }
            },
            suggestedResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "type", "url"]
              }
            }
          },
          required: ["predictedScore", "performanceLevel", "recommendations", "strengths", "weaknesses", "subjectBreakdown", "suggestedResources"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result: PredictionResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid prediction from the AI model.");
  }
}

export async function getChatbotResponse(history: ChatMessage[], newMessage: string, context?: string): Promise<string> {
    const formattedHistory = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const prompt = `
You are a friendly and helpful AI Study Helper within the app Learnlytics. Your goal is to answer a student's academic questions clearly and concisely. Keep your answers brief and to the point.
${context ? `The user is currently asking a question within a specific context: ${context}. Prioritize answering questions related to this context.` : 'The user is asking a general question.'}

Conversation History:
${formattedHistory}
user: ${newMessage}
bot:`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
}

export async function getFlashcards(topic: string): Promise<Flashcard[]> {
    const prompt = `
        Generate a list of 6 flashcards for the topic: "${topic}".
        Return a JSON object with a single key "flashcards" which is an array of objects.
        Each object should have two keys: "question" and "answer".
        The question should be concise and on the front of the card.
        The answer should be brief and on the back of the card.
        Do not include any other text or markdown formatting.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        flashcards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                },
                                required: ["question", "answer"]
                            }
                        }
                    },
                    required: ["flashcards"]
                }
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.flashcards;
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards.");
    }
}

export async function getPerformanceReport(prediction: PredictionResult): Promise<string> {
    const prompt = `
    You are an expert AI academic advisor. Write a comprehensive, narrative performance report for a student based on their prediction data. The report should be encouraging, insightful, and formatted in clean HTML.

    Prediction Data:
    - Predicted Score: ${prediction.predictedScore.toFixed(1)}%
    - Performance Level: ${prediction.performanceLevel}
    - Strengths: ${prediction.strengths.join(', ')}
    - Weaknesses: ${prediction.weaknesses.join(', ')}
    - Key Recommendations: ${prediction.recommendations.join('; ')}

    Generate an HTML string with the following structure:
    - Start with a summary paragraph providing an overview of the performance.
    - Create a section "<h3>Key Strengths</h3>" with a "<ul>" list of the strengths.
    - Create a section "<h3>Areas for Improvement</h3>" with a "<ul>" list of the weaknesses.
    - Create a section "<h3>Actionable Recommendations</h3>" with a "<ul>" list of the recommendations.
    - Conclude with an encouraging closing paragraph.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating performance report:", error);
        throw new Error("Failed to generate the performance report.");
    }
}

export async function getLiveStudyResources(setup: StudySessionSetup, userProfile: UserProfile, prediction: PredictionResult | null): Promise<SessionResource[]> {
  const prompt = `
    You are an expert AI learning strategist. A student is starting a study session and needs a curated list of resources to guide them.

    Session Details:
    - Subject: ${setup.subject}
    - Duration: ${setup.duration} minutes
    - Stated Goal: "${setup.goal}"

    Student's Profile:
    - Preferred Learning Style: ${userProfile.learningStyle}
    - Known Weaknesses (from last prediction): ${prediction?.weaknesses.join(', ') || 'None available'}

    Generate a JSON object with a key "resources", which is an array of 3-4 helpful resource objects for this specific study session.
    Each resource object must have:
    - 'type': Can be 'concept', 'video', or 'question'.
    - 'title': A concise title for the resource.
    - 'content': For 'concept', this is a brief explanation (2-3 sentences) that may contain bracketed keywords for the explainer tool, like "The core idea of [explain:Calculus] is...". For 'video', it's a plausible YouTube search query. For 'question', it's a thought-provoking question to test understanding.

    CRITICAL: The resources MUST be tailored to the student's learning style.
    - Visual: Prioritize concepts with visual descriptions, and video links. Use explainer tags like [explain:Photosynthesis Diagram].
    - Auditory: Suggest video links or concepts that can be easily read aloud.
    - Reading/Writing: Prioritize detailed concept explanations and challenging questions.
    - Kinesthetic: Suggest interactive ideas or thought experiments within the 'question' type.
    
    The resources should directly address the student's stated goal and known weaknesses.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["type", "title", "content"]
              }
            }
          },
          required: ["resources"]
        }
      }
    });
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.resources;
  } catch (error) {
    console.error("Error generating study session resources:", error);
    throw new Error("Failed to generate study resources from the AI model.");
  }
}

export async function generateSessionQuiz(session: StudySessionSetup): Promise<QuizQuestion[]> {
  const prompt = `
    You are an AI quiz master. Based on the following study session, generate a short 4-question multiple-choice quiz to test the user's understanding.

    Session Subject: ${session.subject}
    Session Goal: ${session.goal}

    Provide your response as a JSON object with a single key "quiz", which is an array of 4 question objects.
    Each question object must have:
    - "question": The question text.
    - "options": An array of 4 string options. One of these must be the correct answer.
    - "correctAnswer": The exact string of the correct answer from the options array.

    Do not include any other text or markdown formatting.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer"],
              },
            },
          },
          required: ["quiz"],
        },
      },
    });
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.quiz;
  } catch (error) {
    console.error("Error generating session quiz:", error);
    throw new Error("Failed to generate a quiz from the AI model.");
  }
}

export async function explainConcept(concept: string, type: 'simple' | 'analogy' | 'visualize'): Promise<string> {
  let prompt = `You are an expert AI teacher. A student needs help understanding a concept: "${concept}".\n\n`;

  switch(type) {
    case 'simple':
      prompt += "Explain this concept in simple, easy-to-understand terms. Be concise (2-3 paragraphs max).";
      break;
    case 'analogy':
      prompt += "Provide a relatable analogy or metaphor to help understand this concept.";
      break;
    case 'visualize':
      prompt += "Generate a Mermaid.js 'graph TD' or 'mindmap' diagram string to visually represent this concept. Show the key components and their relationships. ONLY output the Mermaid code block. Do not include any other text or markdown formatting. Start with 'graph TD' or 'mindmap'.";
      break;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error explaining concept:", error);
    throw new Error("Failed to get an explanation from the AI model.");
  }
}


export async function getAIGoalSuggestion(studentData: StudentData, historicalData: HistoricalEntry[]): Promise<{ suggestedGoal: number; reason: string }> {
  const latestPrediction = historicalData.length > 0 ? historicalData[historicalData.length - 1].prediction.predictedScore : 'N/A';
  const prompt = `
    You are an AI academic advisor. A student wants a realistic but challenging goal for their next performance prediction.

    Current Student Data:
    - Attendance: ${studentData.attendance}%
    - Assignment Score: ${studentData.assignmentScore}%
    - Study Hours: ${studentData.studyHours}/day
    - Previous GPA: ${studentData.previousGPA}

    Historical Predicted Scores: ${historicalData.map(h => h.prediction.predictedScore.toFixed(1)).join(', ') || 'None'}
    Latest Predicted Score: ${latestPrediction}

    Based on this, suggest a single, achievable target score for their next evaluation. It should be a slight improvement on their current trajectory.

    Provide your response as a JSON object with two keys:
    - "suggestedGoal": A single number (e.g., 88).
    - "reason": A short, encouraging string explaining why this goal is appropriate (e.g., "Based on your strong assignment scores, a small increase in study time could easily push you to this level.").
    Do not include any other text or markdown formatting.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedGoal: { type: Type.NUMBER },
            reason: { type: Type.STRING },
          },
          required: ["suggestedGoal", "reason"],
        }
      }
    });
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error("Error getting AI goal suggestion:", error);
    throw new Error("Failed to get a goal suggestion from the AI model.");
  }
}

export async function getStudyPlan(input: PlannerInput): Promise<StudyTask[]> {
  const prompt = `
    You are an expert AI academic planner. Create a weekly study plan for a student based on their inputs.

    Student's Inputs:
    - Subjects: ${input.subjects.join(', ')}
    - Key Deadlines/Exams: ${input.examDates || 'Not specified'}
    - Target Weekly Study Hours: ${input.weeklyHours}
    - Known Weaknesses: ${input.weaknesses.join(', ')}
    - Preferred Learning Style: ${input.learningStyle}

    Generate a JSON object with a key "studyPlan", which is an array of study task objects for a 7-day week.
    Prioritize subjects the student is weak in. Distribute the study hours realistically across the week.
    Each task object must have:
    - 'day': The day of the week (e.g., "Monday").
    - 'subject': The subject for the task.
    - 'task': A specific, actionable task (e.g., "Review Chapter 3 notes", "Complete 10 practice problems"). Tailor tasks to the learning style (e.g., suggest 'Watch Khan Academy video on...' for visual learners).
    - 'time': A suggested time block (e.g., "6:00 PM - 7:30 PM").
    - 'priority': A priority level ('High', 'Medium', or 'Low').

    Ensure the total time adds up roughly to the student's weekly target. Do not include any other text or markdown formatting.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  task: { type: Type.STRING },
                  time: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ["day", "subject", "task", "time", "priority"],
              }
            }
          },
          required: ["studyPlan"],
        }
      }
    });
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.studyPlan;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan from the AI model.");
  }
}
