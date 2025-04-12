export const handlePending = (state) => {
    state.loading = true;
};

export const handleRejected = (state, action) => {
    state.loading = false;
    state.error = action?.payload;
};




export const handleApiError = (error) => {
    if (error?.response?.status === 500) {
      return { error: "Something went wrong on our end. Please try again later." };
    }
  
    if (error?.response?.data) {
      // if API returns a structured error like { error: "message" } or { detail: "message" }
      const data = error.response.data;
      const message = data.error || data.detail || data.message;
      return { error: message || "Something went wrong" };
    }
  
    return { error: "Network error. Please check your connection." };
  };



  const fullCompletionMessages = [
    "🎯 You did it! You completed exactly what you set out to do — well done!",
    "✅ Task complete! Consistency is key, and you nailed it!",
    "🏁 You’ve reached your goal — solid work!"
  ];
  
  const underCompletionMessages = [
    "🌱 Something is always better than nothing. Great attempt!",
    "👏 You made progress — and that’s what counts. Keep going!",
    "✨ Every small step adds up. You’re on the right path!"
  ];
  
  const overCompletionMessages = [
    "🔥 Overachiever alert! You went beyond the goal — awesome!",
    "🚀 You didn’t just finish, you *excelled*! Keep up that energy!",
    "🌟 That’s some next-level hustle! Exceeded expectations!"
  ];
  
  export const getRandomMessage = (type) => {
    const messages = {
      full: fullCompletionMessages,
      under: underCompletionMessages,
      over: overCompletionMessages,
    };
  
    const chosenArray = messages[type] || [];
    const randomIndex = Math.floor(Math.random() * chosenArray.length);
    return chosenArray[randomIndex];
  };
  
  