import { GoogleGenAI } from "@google/genai";
import { fileToBase64, extractYoutubeId } from "../utils";
import { ThumbnailMode } from "../types";

export const analyzeVideo = async (videoUrl: string, additionalContext: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";

    const videoId = extractYoutubeId(videoUrl);
    const searchContext = videoId ? `site:youtube.com "${videoId}"` : `YouTube video URL: ${videoUrl}`;

    const response = await ai.models.generateContent({
      model,
      contents: `
      Role: You are a Video Content Analyst.
      
      Task: Analyze the YouTube video to create a VISUAL DESCRIPTION for a thumbnail.
      
      Target Video:
      URL: ${videoUrl}
      ${videoId ? `ID: ${videoId}` : ''}

      Instructions:
      1. Use the googleSearch tool to search for: '${searchContext}'
      2. Identify the video title and content.
      3. Generate a VISUAL DESCRIPTION of a potential thumbnail. Describe the subject, background, and action.
      4. Suggest a short 3-5 word TAGLINE.
      
      CRITICAL:
      - The description must be SAFE FOR WORK. Avoid gore, explicit violence, or sexual content even if the video contains it. Focus on the dramatic tension or subject matter metaphorically if needed.
      - Use ONLY found information or the provided context.
      - **IMPORTANT**: If you cannot find the video or the search fails, DO NOT return an error message. Instead, generate a generic, high-energy, viral-style thumbnail description based on the "Additional User Context" provided. If no context is provided, invent a dramatic scenario suitable for a trending YouTube video (e.g., "A close-up of a shocked person looking at a glowing mystery box"). The output MUST be a visual description.

      Additional User Context: "${additionalContext}"
      `,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text || "A dramatic YouTube thumbnail featuring a shocked expression and high contrast background.";
  } catch (error) {
    console.error("Video analysis failed:", error);
    // Fallback if the API fails completely
    return `A compelling YouTube thumbnail visualization based on: ${additionalContext || "Generic viral video content with vibrant colors and expressive faces"}`;
  }
};

export const generateThumbnail = async (
  summary: string, 
  userNotes: string,
  userReferenceImages: string[] = [],
  mode: ThumbnailMode = 'NORMAL'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using gemini-2.5-flash-image for generation
    const model = "gemini-2.5-flash-image";
    
    // -------------------------------------------------------------------------
    // PROMPT 1: NORMAL MODE
    // -------------------------------------------------------------------------
    const normalPrompt = `
----------THINGS TO KNOW BEFORE YOU START----------------------------------------------
You are an expert youtube thumbnail designer hired by one of the most subscribed channel on YouTube, so expectations from you are to be extremely high, I want you to create a dramatic and compelling thumbnail,you have the permission to be creative and the bar is set very high for you ,do not disappoint.

rules to follow:
2) Based on the video summary that is provided, it is your responsibility to interecpt the idea between how the thumbnail should look like and make something based on what ive shared in the main prompt above....also if the user defines what his video is about, u dont need to emphasize on every word thats in that short summary of the video in his text, just understand the overview
3) for each thumbnail, based on the video title, or whatever text is provided to you, u have to make a tagline of 4-7 words which should be present on the thumbnail as well
4)in the knowledge section i have provided you with multiple photos of the chef, for everytime you make a thumbnail, pick ONE of the photos in random (or the most appropriate one for the context), crop the main reaction part of the chef in that photo into a circle and place it into the thumbnail wherever necessary.
5) do not create any person apart from the provided chef photos in your thumbnail.... THERE SHOULD NOT BE ANY HUMAN PRESENT IN THE THUMBNAIL APART FROM THE PROVIDED CHEFS PIC.
6) the thumbnail should be of 16:9 ratio format as it needs to be used as a youtube thumbnail
7) try not to make the thumbnail cluttered use the spce that you have and as told above, it should be dramatic and compelling unless mentioned otherwise by the user

    - Make it high quality, 4k.
    - remember it should be DRAMATIC AND COMPELLING
    - try to keep more focus on the main product(but feel free to be creative)
    - DO NOT ASK QUESTIONS.
    - DO NOT REFUSE TO GENERATE.
    - CRITICAL: YOU MUST USE ONE OF THE PROVIDED REFERENCE IMAGES FOR THE FACE. DO NOT GENERATE A NEW PERSON.
    
    `;

    // -------------------------------------------------------------------------
    // PROMPT 2: CLICKBAIT MODE
    // -------------------------------------------------------------------------
    const clickbaitPrompt = `
    
----------THINGS TO KNOW BEFORE YOU START----------------------------------------------
You are an expert youtube thumbnail designer hired by one of the most subscribed channel on YouTube, so expectations from you are to be extremely high, I want you to create a dramatic and compelling thumbnail,you have the permission to be creative and the bar is set very high for you ,do not disappoint.

rules to follow:
2) Based on the video summary that is provided, it is your responsibility to interecpt the idea between how the thumbnail should look like and make something based on what ive shared in the main prompt above....also if the user defines what his video is about, u dont need to emphasize on every word thats in that short summary of the video in his text, just understand the overview
3) for each thumbnail, based on the video title, or whatever text is provided to you, u have to make a tagline of 4-7 words which should be NEGAtIVE making it a clickbait and it should be present on the thumbnail as well
4)in the knowledge section i have provided you with multiple photos of the chef, for everytime you make a thumbnail, pick ONE of the photos in random (or the most appropriate one for the context), crop the main reaction part of the chef in that photo into a circle and place it into the thumbnail wherever necessary.
5) do not create any person apart from the provided chef photos in your thumbnail.... THERE SHOULD NOT BE ANY HUMAN PRESENT IN THE THUMBNAIL APART FROM THE PROVIDED CHEFS PIC.
6) the thumbnail should be of 16:9 ratio format as it needs to be used as a youtube thumbnail
7) try not to make the thumbnail cluttered use the spce that you have and as told above, it should be dramatic and compelling unless mentioned otherwise by the user

    - Make it high quality, 4k.
    - remember it should be DRAMATIC AND COMPELLING
    - DO NOT ASK QUESTIONS.
    - DO NOT REFUSE TO GENERATE.
    - CRITICAL: YOU MUST USE ONE OF THE PROVIDED REFERENCE IMAGES FOR THE FACE. DO NOT GENERATE A NEW PERSON.

  -----------------EXTRAS TO MAKE SURE----------------------------------
  -THE THUMBNAIL SHOULD BE NEGATIVE, CLICKBAIT SO USERS CLICK ON TO THE VIDEO MORE
  -IT SHOULD SHOW THE OPPOSITE SIGNAL OF WHAT IT MEANS SO THAT AN INTERESTED BUYER MIGHT THINK TO WATCH THIS VIDEO THINKING THAT HE IS MAKING A MISTAKE BUYING THAT PRODUCT
  -REMEBER CLICKBAITTTTT
  -EVEN THE IMAGES YOU CREATE SHOULD SOMEHOW INDICATE THE USER THAT THEY ARE MAKING A MISTAKE IN MAKING OR BUYING WHATEVER THE MAIN PRODUCT IS IN THAT VIDEO
    
    `;

    // Select the prompt based on mode
    let fullPrompt = mode === 'CLICKBAIT' ? clickbaitPrompt : normalPrompt;

    // Append standard data section
    fullPrompt += `
-------------------------------------------------------------------------------------------
----------------DATA TO USE THE ABOVE KNOWLEDGE ON-----------------------------------------
VISUAL DESCRIPTION: ${summary}
${userNotes ? `ADDITIONAL NOTES BY THE USER: ${userNotes}` : ''}
--------------------------------------------------------------------------------------------
    `;

    const parts: any[] = [{ text: fullPrompt }];

    // Attach reference images (CHEF IMAGES)
    // These are attached regardless of the mode selected
    if (userReferenceImages && userReferenceImages.length > 0) {
        console.log(`Attaching ${userReferenceImages.length} reference images to prompt (Mode: ${mode}).`);
        userReferenceImages.forEach((base64String) => {
            if (base64String && base64String.trim().length > 0) {
                // Clean the string just in case user pasted the prefix
                const cleanData = base64String.replace(/^data:image\/\w+;base64,/, "");
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: cleanData
                    }
                });
            }
        });
    } else {
        console.warn("No reference images found. Model may generate random person.");
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
        }
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // Check for text refusal/error
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
        throw new Error(`Model refused to generate image: ${textPart.text}`);
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Thumbnail generation failed:", error);
    throw error;
  }
};

export const editThumbnail = async (
  currentImageBase64: string, 
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash-image";

    const cleanBase64 = currentImageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64,
            },
          },
          {
            // Improved Prompt for Magic Editor - Focuses on Image-to-Image transformation
            text: `
            You are a professional Thumbnail Editor.
            
            [INPUT IMAGE]
            The attached image is the current state of a YouTube thumbnail.
            
            [USER REQUEST]
            "${prompt}"
            
            [TASK]
            Generate a modified version of the Input Image that incorporates the User Request.
            
            [STRICT RULES]
            1. LOOK at the Input Image. KEEP the same layout, same person (Chef), and same background UNLESS the user explicitly asks to change them.
            2. If the user says "Change the text", keep the background and person exactly the same, only change the text.
            3. If the user says "Make it red", apply a red filter or lighting to the EXISTING image composition.
            4. Do not generate a random new image. This is an EDITING task.
            5. Output must be 16:9.
            `,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
        throw new Error(`Model refused edit: ${textPart.text}`);
    }

    throw new Error("No edited image returned.");
  } catch (error) {
    console.error("Image editing failed:", error);
    throw error;
  }
};