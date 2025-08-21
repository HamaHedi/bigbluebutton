export const warnConsoleOpen = () => {
    const styleTitle = `
      color: #fff;
      font-size: 22px;
      font-weight: bold;
      background: #ff0000;
      padding: 8px 16px;
      border-radius: 6px;
    `;
  
    const styleMsg = `
      color: orange;
      font-size: 16px;
      font-weight: bold;
    `;
  
    const styleSmall = `
      color: gray;
      font-size: 12px;
    `;
  
    console.log('%c🚨 STOP! 🚨', styleTitle);
    console.log('%cThis place is dangerous... hackers live here! 🧑‍💻', styleMsg);
    console.log('%c(Unless you’re a pro... then carry on 😎)', styleSmall);
};
  