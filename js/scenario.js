const CHARACTERS = {
  you: {
    id: 'you',
    name: 'You',
    role: 'Employee',
    skin: '#D4A574',
    shirt: '#27AE60',
    pants: '#1E3A2F',
    hair: '#1a1a1a',
    hairStyle: 'short'
    // To use a real imported human model instead of procedural:
    // model: 'models/you.glb'
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    role: 'Your Manager',
    skin: '#F5CBA7',
    shirt: '#6C5CE7',
    pants: '#2D3436',
    hair: '#4A3728',
    hairStyle: 'bob'
    // model: 'models/alex.glb'
  }
};

const SCENARIO = {
  title: 'The Raise',
  subtitle: 'Negotiate your salary with your manager',
  intro: 'You scheduled a 1-on-1 with Alex, your manager. You\'ve been at the company 18 months with strong performance reviews. Time to ask for a raise.',
  nodes: {
    start: {
      speaker: 'alex',
      text: "Hey! Good to see you. I know you wanted to talk — what's on your mind?",
      mood: 'neutral',
      choices: [
        { text: "I'd like to discuss my compensation.", next: 'direct_open', rapport: 2, assert: 1 },
        { text: "Thanks for making time. I have some thoughts on my role and pay.", next: 'warm_open', rapport: 3, assert: 0 },
        { text: "Um... I was wondering if we could talk about my salary?", next: 'timid_open', rapport: 1, assert: -1 }
      ]
    },
    direct_open: {
      speaker: 'alex',
      text: "Straight to the point — I appreciate that. What number are you thinking?",
      mood: 'neutral',
      choices: [
        { text: "Based on my contributions, I believe $85K is fair. Market rate for my role is $82-88K.", next: 'data_ask', rapport: 2, assert: 2 },
        { text: "I want a 15% raise. I've earned it.", next: 'aggressive_ask', rapport: -1, assert: 3 },
        { text: "I'd love your guidance on what a reasonable adjustment looks like.", next: 'defer_ask', rapport: 2, assert: -1 }
      ]
    },
    warm_open: {
      speaker: 'alex',
      text: "Of course. You've been doing great work on the product launch. Walk me through your thinking.",
      mood: 'happy',
      choices: [
        { text: "I led the Q3 launch that increased signups 34%. I'd like my pay to reflect that impact.", next: 'data_ask', rapport: 3, assert: 1 },
        { text: "I feel undervalued compared to peers. I need a significant bump.", next: 'aggressive_ask', rapport: -2, assert: 2 },
        { text: "What would it take for me to reach the next compensation band?", next: 'defer_ask', rapport: 3, assert: 0 }
      ]
    },
    timid_open: {
      speaker: 'alex',
      text: "No need to be nervous — this is a normal conversation. Tell me what you're hoping for.",
      mood: 'neutral',
      choices: [
        { text: "I researched market rates and think $85K aligns with my experience.", next: 'data_ask', rapport: 2, assert: 1 },
        { text: "I just think I deserve more money.", next: 'aggressive_ask', rapport: -2, assert: 0 },
        { text: "Whatever you think is fair, honestly.", next: 'defer_ask', rapport: 1, assert: -2 }
      ]
    },
    data_ask: {
      speaker: 'alex',
      text: "Solid preparation — I respect that. Budget is tight, but I can do $80K now with a review in 6 months. How does that land?",
      mood: 'neutral',
      choices: [
        { text: "I appreciate the offer. Could we meet at $82K now? That's the midpoint.", next: 'counter_mid', rapport: 2, assert: 1 },
        { text: "$80K works if the 6-month review is guaranteed in writing.", next: 'accept_conditional', rapport: 3, assert: 0 },
        { text: "That's below market. I need at least $85K or I'll need to explore options.", next: 'ultimatum', rapport: -3, assert: 3 }
      ]
    },
    aggressive_ask: {
      speaker: 'alex',
      text: "I hear your frustration, but ultimatums aren't how we work here. I can stretch to $78K. Take it or we table this.",
      mood: 'concerned',
      choices: [
        { text: "You're right — let me reframe. $80K with clear milestones for $85K in 6 months?", next: 'recover', rapport: 1, assert: 0 },
        { text: "Fine, $78K. But I expect a serious review next quarter.", next: 'accept_low', rapport: 0, assert: -1 },
        { text: "I'll take my talents elsewhere then.", next: 'walk_away', rapport: -5, assert: 3 }
      ]
    },
    defer_ask: {
      speaker: 'alex',
      text: "I can offer $79K today and map out a path to $85K over the next year. You'd need to lead the analytics project.",
      mood: 'happy',
      choices: [
        { text: "That path works — let's define clear milestones together.", next: 'accept_path', rapport: 4, assert: 0 },
        { text: "I need at least $81K now to make this work financially.", next: 'counter_mid', rapport: 1, assert: 1 },
        { text: "A year is too long. I need $83K within 3 months or I walk.", next: 'ultimatum', rapport: -2, assert: 2 }
      ]
    },
    counter_mid: {
      speaker: 'alex',
      text: "Let me check... OK. $82K effective next pay period, plus a $2K signing bonus for the analytics project. Deal?",
      mood: 'happy',
      choices: [
        { text: "That's fair. Let's shake on it.", next: 'ending_good', rapport: 3, assert: 1 },
        { text: "Can we make it $83K and skip the bonus?", next: 'final_push', rapport: 0, assert: 2 }
      ]
    },
    accept_conditional: {
      speaker: 'alex',
      text: "Done — I'll put the 6-month review in your development plan with target $85K. $80K starts next cycle.",
      mood: 'happy',
      choices: [
        { text: "Thank you, Alex. I appreciate you working with me.", next: 'ending_good', rapport: 4, assert: 0 }
      ]
    },
    accept_path: {
      speaker: 'alex',
      text: "Perfect. I'll draft the milestone doc this week. $79K now, analytics lead role, path to $85K. Sound good?",
      mood: 'happy',
      choices: [
        { text: "Sounds great. Let's do it.", next: 'ending_good', rapport: 4, assert: 0 }
      ]
    },
    accept_low: {
      speaker: 'alex',
      text: "Noted. $78K effective immediately. I'll schedule a formal review in 90 days.",
      mood: 'neutral',
      choices: [
        { text: "OK. I'll hold you to that review.", next: 'ending_ok', rapport: 0, assert: 0 }
      ]
    },
    recover: {
      speaker: 'alex',
      text: "That's the collaborative energy I was hoping for. $80K now, documented path to $85K at 6 months. Agreed?",
      mood: 'happy',
      choices: [
        { text: "Agreed. Thank you for hearing me out.", next: 'ending_good', rapport: 3, assert: 0 }
      ]
    },
    final_push: {
      speaker: 'alex',
      text: "You're tough! $82.5K, no bonus. Final offer — I have another meeting in 2 minutes.",
      mood: 'neutral',
      choices: [
        { text: "Deal. $82.5K it is.", next: 'ending_great', rapport: 2, assert: 2 },
        { text: "I'll take the $82K + bonus instead.", next: 'ending_good', rapport: 3, assert: 0 }
      ]
    },
    ultimatum: {
      speaker: 'alex',
      text: "I can't meet that timeline or number. I respect your ambition, but this isn't the right fit if it's non-negotiable.",
      mood: 'concerned',
      choices: [
        { text: "Let me reconsider — what IS possible in the next 3 months?", next: 'recover', rapport: 1, assert: -1 },
        { text: "I understand. I'll start looking elsewhere.", next: 'walk_away', rapport: -3, assert: 2 }
      ]
    },
    walk_away: {
      speaker: 'alex',
      text: "I'm sorry it came to this. You're talented — I hope we can part on good terms. HR will be in touch.",
      mood: 'concerned',
      ending: true,
      outcome: 'walked',
      summary: "You ended the negotiation abruptly. Walking away is sometimes valid, but burning bridges cost future references."
    },
    ending_great: {
      speaker: 'alex',
      text: "Excellent negotiation! You got above the initial offer while keeping the relationship strong. Welcome to the next level.",
      mood: 'happy',
      ending: true,
      outcome: 'great',
      summary: "Outstanding result: $82.5K with rapport intact. You used data, countered strategically, and knew when to close."
    },
    ending_good: {
      speaker: 'alex',
      text: "Great work today. You made a strong case and we found a deal that works for both of us.",
      mood: 'happy',
      ending: true,
      outcome: 'good',
      summary: "Solid negotiation. You secured a meaningful raise while preserving your relationship with your manager."
    },
    ending_ok: {
      speaker: 'alex',
      text: "We'll revisit this soon. Next time, come with more specific data — it'll strengthen your position.",
      mood: 'neutral',
      ending: true,
      outcome: 'ok',
      summary: "Modest outcome. You got something, but left value on the table. Preparation and confidence will help next round."
    }
  }
};