/* ===========================================================
   EDIT THIS FILE ONLY. Everything on the site comes from here.
   Anything in [square brackets] is a placeholder: replace it.
   =========================================================== */
window.SITE = {
  name: "Siri",
  fullName: "Siri Chandana",
  from: "Mr Yashwanth",

  // The exact moment you two met (year-month-day T hour:minute:second).
  // The live counter at the top counts from here.
  metDate: "2025-11-07T00:00:00",

  // THE BIG ONE: the site stays locked until this exact moment.
  // Midnight at the start of 7 November 2026, India time (+05:30).
  // Do NOT change this, except to test (see README), then change it back.
  unlockAt: "2026-11-07T00:00:00+05:30",

  countdown: {
    title: "Siri, something is waiting for you",
    note: "It opens at midnight, 7 November.",
    openTitle: "Happy birthday, Siri",
    openButton: "Open your surprise"
  },

  // Optional gate (not needed now that there is a countdown, leave empty). Leave answer empty ("") to turn it off.
  // Pick a question only Siri can answer. Note: this keeps casual
  // visitors out, it is not real security.
  gate: {
    question: "What was the date we first met actually? (dd/mm/yyyy)",
    answer: ""
  },

  // Photo in the rectangle on the first screen.
  heroPhoto: "photos/82.jpg",

  // Gallery: files must be named 1.jpg, 2.jpg ... up to photoCount.
  photoCount: 100,
  photoExt: "jpg",
  // Optional captions by photo number.
  captions: {
    // 1: "The day we met",
    // 25: "Our first trip"
  },

  letter: {
    title: "Hey, Siri",
    paragraphs: [
      "Exact ga one year back idhe roju kalisam neeku gurthundho ledho but nak inka kalla mundhe undhi, endhukante asale marchipolenu rou ga nen chesina panulaku neek occhina chiraku gurthosthu untadhi naku aroju andtha chiraku padda eroju matram ila kalisipoyam, may be idhe nemo wonder antey.",
      "kani aroju nen ochinandhuku chala badha esindhi ochinandhuku value ledhu ani a time lo entha speed lo bike meedha elano irritation tho nake telidhu, but malli call chesi cool chesav, aa tharvatha eno matladukunnam and first time we meet on a road infront of your college then you impressed some what a roju nen pettina efforts nak inka gurthu unnai ninnu padeyadaniki ela ante kkotha pant kuda konukunna and then we meet again for movie just nuv movie chudam annandhaku bellary nundi single day lo vacchi ela ala neekosam enni times ochano nake telitle edho magic undhi siri neelo ala attract chesesthav nanu, fullu ga allari chesthav edusthav bujagisthav arusthav kopam osthundhi but finally nuv na meeddha chupinche love matram evani marchi poyela chesthundhi adhento emo on this special day i am saying again i love you, i love you siri please edhantha mee mummy ki ithey chupinchaku naku fullu sigithundhi, manaku chala memories unnai but I want to make more memories with in future actually I miss you a lot every time because of this long distance relation ship: my person, my home, the first one I want to tell everything to.",
      "And neeku chala cheppali but paper saripodhu like chebutha chebutho neethona chebutha ani malli rathrina aina kaburulu mugisena a song in arjun reddy Thank you for the the laughter, the late-night talks, and for choosing me again every single day. [Those pics were really beautifull which sent me on 28th of sep 2026.]",
      "I made this little corner of the internet so your birthday could hold all of us in one place. Scroll slowly. Every photo here is a day I would live again."
    ],
    signoff: "Happy birthday, Siri. I love you.",
    sender: "Your Bunny bava"
  },

  // Add, remove or reorder as you like. "photo" is optional.
  timeline: [
    { date: "07 Nov 2025", title: "The day we met first time but not Happy",
      text: "The day you hated me really.", photo: "" },
    { date: "12 Dec 2025", title: "The day we met first time happily",
      text: "The day you drive scooty with me in your back seat.", photo: "photos/1.jpg" },
    { date: "10 Jan 2025", title: "The first bouquet I bought for you",
      text: "The bouquet you loved the most.", photo: "photos/3.jpg" },
    { date: "10 Jan 2025", title: "First movie we seen",
      text: "The day when I only seen you but not movie.", photo: "photos/4.jpg" },
    { date: "26 Jan 2025", title: "The day we went long drive and shared our first choclate",
      text: "A day that i never going to forget.", photo: "photos/8.jpg" },
    { date: "28 April 2025",
      text: "The first time we went to temple together with so much of love.", photo: "photos/47.jpg" }
  ],

  // 2-3 videos. Put files in the videos folder (mp4, under ~30 MB each).
  videos: [
    { src: "videos/video1.mp4", title: "Hey my love", text: "", poster: "" },
    { src: "videos/video2.mp4", title: "Skipped my Heart Beat", text: "", poster: "" },
    { src: "videos/video3.mp4", title: "The beauty I never admired", text: "", poster: "" }
  ],

  finale: {
    button: "Tap for one last surprise",
    message: "Here's to many more birthdays together, my Siri. You are my favourite person, my best friend, and my forever."
  }
};
