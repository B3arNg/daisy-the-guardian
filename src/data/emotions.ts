export const emotionWheel: Record<string, Record<string, string[]>> = {
  Joy: {
    Cheerful: ["Playful", "Amused"],
    Content: ["Satisfied", "Pleased"],
    Proud: ["Triumphant", "Successful"],
    Optimistic: ["Eager", "Hopeful"],
    Enthusiastic: ["Excited", "Zealous"],
  },
  Sadness: {
    Lonely: ["Isolated", "Abandoned"],
    Vulnerable: ["Fragile", "Helpless"],
    Despair: ["Grief", "Powerless"],
    Guilty: ["Remorseful", "Ashamed"],
    Depressed: ["Empty", "Inferior"],
  },
  Anger: {
    LetDown: ["Betrayed", "Resentful"],
    Humiliated: ["Disrespected", "Ridiculed"],
    Bitter: ["Indignant", "Violated"],
    Mad: ["Furious", "Jealous"],
    Aggressive: ["Provoked", "Hostile"],
  },
  Fear: {
    Scared: ["Helpless", "Frightened"],
    Anxious: ["Overwhelmed", "Worried"],
    Insecure: ["Inadequate", "Inferior"],
    Weak: ["Worthless", "Insignificant"],
    Rejected: ["Excluded", "Persecuted"],
  },
  Surprise: {
    Startled: ["Shocked", "Dismayed"],
    Confused: ["Disillusioned", "Perplexed"],
    Amazed: ["Astonished", "Awe"],
    Excited: ["Eager", "Energetic"],
  },
  Disgust: {
    Disapproving: ["Judgmental", "Embarrassed"],
    Disappointed: ["Appalled", "Revolted"],
    Awful: ["Nauseated", "Detestable"],
    Repelled: ["Horrified", "Hesitant"],
  }
};

export type CoreEmotion = keyof typeof emotionWheel;
