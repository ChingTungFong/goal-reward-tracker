import { Language } from '../types';

export interface TemplateData {
  goalName?: string;
  goalEmoji?: string;
  treatName?: string;
  treatEmoji?: string;
  periodLabel?: string;
  totalCheckIns?: number;
  target?: number;
  treatsEarned?: number;
  treatsRedeemed?: number;
  goalsAchieved?: number;
  milestonePercent?: number;
}

export interface CheerfulMessage {
  title: string;
  body: string;
}

export const TEMPLATES = {
  treat_earned: {
    en: [
      {
        title: "Delicious Reward Unlocked! ✨",
        body: (d: TemplateData) => `Amazing consistency! Your hard work on ${d.goalEmoji || ''} "${d.goalName}" earned you 1 ${d.treatEmoji || '🎁'} ${d.treatName}! Go ahead and savour it when you're ready.`,
      },
      {
        title: "You Earned It! 🌟",
        body: (d: TemplateData) => `Ding ding! Another check-in completed, and boom: +1 ${d.treatEmoji || ''} ${d.treatName} unlocked! Effort feels so sweet when it pays off like this.`,
      },
      {
        title: "Sweet Victory! 🧋",
        body: (d: TemplateData) => `Loyalty stamp full! You've officially earned your treat: ${d.treatEmoji || ''} ${d.treatName}. Remember, true balance means celebrating every step.`,
      },
      {
        title: "Reward In The Bag! 🥐",
        body: (d: TemplateData) => `Look at that discipline! Because of your commitment to ${d.goalName}, a well-deserved ${d.treatEmoji || ''} ${d.treatName} is waiting in your treat bank.`,
      },
      {
        title: "Time To Celebrate! 🎉",
        body: (d: TemplateData) => `High five! Your dedication just turned into pure joy: 1 ${d.treatEmoji || ''} ${d.treatName} earned. You really worked for this one!`,
      },
      {
        title: "Treat Yourself Well! 🎈",
        body: (d: TemplateData) => `Progress feels great, but earning ${d.treatEmoji || ''} ${d.treatName} feels even sweeter! Thank yourself for showing up today.`,
      },
    ],
    zh: [
      {
        title: "努力有回報，獎賞解鎖！ ✨",
        body: (d: TemplateData) => `太厲害喇！你在 ${d.goalEmoji || ''}「${d.goalName}」的堅持，成功換取了 1 份 ${d.treatEmoji || '🎁'}${d.treatName}！準備好隨時享受未？`,
      },
      {
        title: "你值得擁有！ 🌟",
        body: (d: TemplateData) => `叮一聲！又一次完成打卡，獎賞庫即時入賬：+1 份 ${d.treatEmoji || ''}${d.treatName}！一步一腳印換來的享受特別甜。`,
      },
      {
        title: "印花蓋滿，獎品到手！ 🧋",
        body: (d: TemplateData) => `恭喜儲夠次數！正式贏得你的小確幸：${d.treatEmoji || ''}${d.treatName}。懂得自律，更懂得疼愛自己。`,
      },
      {
        title: "美味獎賞已存入！ 🥐",
        body: (d: TemplateData) => `睇下你的毅力！因為你對「${d.goalName}」的付出，一份超正的 ${d.treatEmoji || ''}${d.treatName} 已經在等緊你兌換。`,
      },
      {
        title: "值得開懷慶祝！ 🎉",
        body: (d: TemplateData) => `擊掌慶祝！你的付出轉化成滿滿的幸福感：成功賺取 1 份 ${d.treatEmoji || ''}${d.treatName}。真係好叻！`,
      },
      {
        title: "好好犒賞自己！ 🎈",
        body: (d: TemplateData) => `進步令人興奮，但換到 ${d.treatEmoji || ''}${d.treatName} 更加治癒！多謝今日依然努力前進的自己。`,
      },
    ],
  },

  milestone_reached: {
    en: [
      {
        title: "Significant Milestone Unlocked! 🚀",
        body: (d: TemplateData) => `You're already ${d.milestonePercent}% through your ${d.goalEmoji || ''} "${d.goalName}" goal for ${d.periodLabel}! With ${d.totalCheckIns} check-ins down, you are truly building lasting momentum.`,
      },
      {
        title: "Halfway There & Glowing! 🌈",
        body: (d: TemplateData) => `Milestone reached: ${d.milestonePercent}% completed! Showing up ${d.totalCheckIns} times takes real heart. Keep this cheerful vibe going!`,
      },
      {
        title: "Steady Pacing Pays Off! 🧭",
        body: (d: TemplateData) => `Incredible pace! You've crossed the ${d.milestonePercent}% checkpoint for ${d.goalName}. You're making progress look effortless.`,
      },
      {
        title: "The Momentum Is Real! ⚡",
        body: (d: TemplateData) => `Boom! ${d.milestonePercent}% of target achieved (${d.totalCheckIns}/${d.target} sessions). Every check-in is crafting a healthier, happier routine.`,
      },
      {
        title: "Three Cheers For Consistency! 🎯",
        body: (d: TemplateData) => `You've conquered ${d.milestonePercent}% of your goal! Take a second to admire how far you've come since the start.`,
      },
    ],
    zh: [
      {
        title: "里程碑達成！步伐超穩 🚀",
        body: (d: TemplateData) => `你在 ${d.periodLabel} 的 ${d.goalEmoji || ''}「${d.goalName}」已經達到 ${d.milestonePercent}%！累積打卡 ${d.totalCheckIns} 次，動力滿滿！`,
      },
      {
        title: "不知不覺行咗咁遠！ 🌈",
        body: (d: TemplateData) => `里程碑解鎖：完成度 ${d.milestonePercent}%！堅持出席 ${d.totalCheckIns} 次需要滿滿熱誠，為你的毅力鼓掌！`,
      },
      {
        title: "步步為營，節奏好好！ 🧭",
        body: (d: TemplateData) => `狀態大勇！你已越過「${d.goalName}」的 ${d.milestonePercent}% 關卡。好習慣正在自然而然咁生根。`,
      },
      {
        title: "動力持續燃燒！ ⚡",
        body: (d: TemplateData) => `達成目標 ${d.milestonePercent}%（目前 ${d.totalCheckIns}/${d.target} 次）。每一次打卡都在創造更棒的日常生活。`,
      },
      {
        title: "見證累積的力量！ 🎯",
        body: (d: TemplateData) => `已經搞掂 ${d.milestonePercent}%！停低一秒回頭望，你會發現自己原來已經進步咗咁多。`,
      },
    ],
  },

  goal_achieved: {
    en: [
      {
        title: "Goal Smashed! Champion Energy! 🏆",
        body: (d: TemplateData) => `Mission complete! You crushed your target of ${d.target} check-ins for ${d.goalEmoji || ''} "${d.goalName}" in ${d.periodLabel}! You also earned ${d.treatsEarned} treats along the way.`,
      },
      {
        title: "Trophy Unlocked! Pure Dedication! 🥇",
        body: (d: TemplateData) => `Target reached! ${d.totalCheckIns} check-ins recorded for "${d.goalName}". You set your mind to it, kept your promise to yourself, and won!`,
      },
      {
        title: "Golden Star Moment! ⭐",
        body: (d: TemplateData) => `Congratulations! You fulfilled 100% of your ${d.goalName} goal for ${d.periodLabel}. Hard work done, rewards secured — you're an inspiration!`,
      },
      {
        title: "Perfection in Progress! 🎊",
        body: (d: TemplateData) => `Look at that 100% badge! Target: ${d.target}. Achieved: ${d.totalCheckIns}. You earned every bit of this celebration!`,
      },
      {
        title: "Goal Conquered In Style! 👑",
        body: (d: TemplateData) => `You did it! ${d.periodLabel} goal for ${d.goalEmoji || ''} ${d.goalName} is officially completed. Thank you for never giving up on yourself!`,
      },
    ],
    zh: [
      {
        title: "目標達成！太有型喇！ 🏆",
        body: (d: TemplateData) => `大功告成！你在 ${d.periodLabel} 順利完成 ${d.goalEmoji || ''}「${d.goalName}」的 ${d.target} 次目標，期間仲賺取了 ${d.treatsEarned} 個獎賞！`,
      },
      {
        title: "金牌到手！毅力滿分！ 🥇",
        body: (d: TemplateData) => `完美達標！「${d.goalName}」打卡 ${d.totalCheckIns} 次。對自己的承諾說到做到，這就是最好的自我肯定！`,
      },
      {
        title: "閃令令的光榮時刻！ ⭐",
        body: (d: TemplateData) => `熱烈祝賀！你在 ${d.periodLabel} 的「${d.goalName}」達成率 100%！付出有成果，獎賞落袋，真係無可挑剔！`,
      },
      {
        title: "滿分完勝！值得慶賀 🎊",
        body: (d: TemplateData) => `睇下這個 100% 徽章！預定 ${d.target} 次，實行 ${d.totalCheckIns} 次。今晚值得好好享受屬於你的獎賞！`,
      },
      {
        title: "王者風範，挑戰成功！ 👑",
        body: (d: TemplateData) => `搞掂！${d.periodLabel} 的 ${d.goalEmoji || ''}${d.goalName} 正式宣布圓滿達標。多謝你一直堅持到底！`,
      },
    ],
  },

  weekly_recap: {
    en: [
      {
        title: "Your Weekly Highlights ☀️",
        body: (d: TemplateData) => `Last week you logged ${d.totalCheckIns} check-ins, conquered ${d.goalsAchieved} goals, and earned ${d.treatsEarned} treats (redeemed ${d.treatsRedeemed}). A truly wholesome balance!`,
      },
      {
        title: "Week In Review: Thriving! 📊",
        body: (d: TemplateData) => `What a week! ${d.totalCheckIns} positive habits recorded and ${d.treatsEarned} treats collected. Every day brought you closer to your ideal lifestyle.`,
      },
      {
        title: "Fresh Week, Great Memories 🌱",
        body: (d: TemplateData) => `Last week recap: ${d.goalsAchieved} goals met and ${d.totalCheckIns} check-ins ticked off! You balanced discipline and indulgence like a pro.`,
      },
      {
        title: "Weekly Loyalty Report 💌",
        body: (d: TemplateData) => `Here's your summary: ${d.totalCheckIns} check-ins logged, ${d.treatsEarned} treats added to your piggy bank. Ready to create another fantastic week?`,
      },
      {
        title: "Celebrating Last Week's Wins 🥳",
        body: (d: TemplateData) => `${d.totalCheckIns} moments of dedication, ${d.goalsAchieved} targets hit! Remember: sustainable joy comes from gentle rhythm, not perfection.`,
      },
    ],
    zh: [
      {
        title: "上週精彩回顧 ☀️",
        body: (d: TemplateData) => `上個星期你一共打卡 ${d.totalCheckIns} 次，達成 ${d.goalsAchieved} 個目標，賺取 ${d.treatsEarned} 個獎賞（已享受 ${d.treatsRedeemed} 個）。自律與放鬆平衡得剛剛好！`,
      },
      {
        title: "一週總結：元氣滿滿！ 📊",
        body: (d: TemplateData) => `精彩的一週！累積完成 ${d.totalCheckIns} 次好習慣，收集到 ${d.treatsEarned} 份甜蜜獎賞。生活節奏越來越理想。`,
      },
      {
        title: "新一週展開，回味小進步 🌱",
        body: (d: TemplateData) => `上週成績單：${d.goalsAchieved} 項目標達標，打卡 ${d.totalCheckIns} 次！你掌握了既努力又懂享受的生活智慧。`,
      },
      {
        title: "每週專屬小報 💌",
        body: (d: TemplateData) => `回顧上週：完成 ${d.totalCheckIns} 次打卡，為獎賞庫進賬 ${d.treatsEarned} 個享受機會。準備好迎接全新的一週未？`,
      },
      {
        title: "為上星期的自己鼓掌 🥳",
        body: (d: TemplateData) => `${d.totalCheckIns} 次用心投入，敲下 ${d.goalsAchieved} 個目標！記住，持之以恆不是靠嚴格苛求，而是靠溫柔的節奏。`,
      },
    ],
  },

  gentle_encouragement: {
    en: [
      {
        title: "Gentle Reset & Fresh Start 🌿",
        body: (d: TemplateData) => `Life gets busy, and that's completely okay! You still logged ${d.totalCheckIns} sessions for ${d.goalEmoji || ''} "${d.goalName}". Every single check-in counted, and a fresh clean period begins right now.`,
      },
      {
        title: "Every Step Still Matters 🌸",
        body: (d: TemplateData) => `Even though the target wasn't fully met this cycle, your ${d.totalCheckIns} check-ins are genuine proof of effort. Be proud of showing up, take a deep breath, and restart gently.`,
      },
      {
        title: "Progress Over Perfection 💫",
        body: (d: TemplateData) => `Habits aren't all-or-nothing; they are a lifelong companion. You showed up ${d.totalCheckIns} times! Let's embrace this new cycle with kindness and curiosity.`,
      },
      {
        title: "The Reset Button Is Magic ✨",
        body: (d: TemplateData) => `No guilt, no stress. What matters is the direction, not a rigid checklist. You're building awareness, and this week is your fresh canvas!`,
      },
      {
        title: "Kindness First, Always 💛",
        body: (d: TemplateData) => `Be gentle with yourself. You logged ${d.totalCheckIns} moments of effort during ${d.periodLabel}. Today is day one of your next chapter — you've got this!`,
      },
    ],
    zh: [
      {
        title: "溫柔歸零，重新出發 🌿",
        body: (d: TemplateData) => `生活總有忙碌的時刻，完全不需要自責！在 ${d.periodLabel} 你依然為 ${d.goalEmoji || ''}「${d.goalName}」付出了 ${d.totalCheckIns} 次。每一滴汗水都算數，全新週期今日開始！`,
      },
      {
        title: "每一次付出都是真實的 🌸",
        body: (d: TemplateData) => `就算這個週期差一點點達標，你打卡的 ${d.totalCheckIns} 次都是真真切切的成長。為有嘗試過的自己點讚，抖擻精神再嚟過！`,
      },
      {
        title: "重視前行，無需苛求完美 💫",
        body: (d: TemplateData) => `養成習慣從來不是全有全無，而是一場溫柔的長跑。你出席了 ${d.totalCheckIns} 次！帶著輕鬆的心情，開始下一個週期啦。`,
      },
      {
        title: "每個新週期都是魔法畫布 ✨",
        body: (d: TemplateData) => `沒有包袱，只有期待。生活節奏本來就有起有伏。最重要是你在意自己的生活，今日就係全新起點！`,
      },
      {
        title: "對自己溫柔，是自律的前提 💛",
        body: (d: TemplateData) => `給自己一個擁抱。在 ${d.periodLabel} 裡你曾努力過 ${d.totalCheckIns} 次。休息夠了，隨時都能以最舒適的步伐繼續向前！`,
      },
    ],
  },
};

export function getRandomTemplate(
  situation: keyof typeof TEMPLATES,
  lang: Language,
  data: TemplateData
): CheerfulMessage {
  const templates = TEMPLATES[situation][lang];
  const selected = templates[Math.floor(Math.random() * templates.length)];
  return {
    title: selected.title,
    body: selected.body(data),
  };
}
