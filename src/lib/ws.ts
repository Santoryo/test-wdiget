// assuming that you've already parsed out port and authorization into variables.

export const ws = new WebSocket(`ws://localhost:8092/api/realtime?authorization=09erZX1B6JRnsbKgKfFS0ZCPWTv5uiVA2HbSXPqtdfGZcixzd707f7htBbIgrSYW`);



ws.onmessage = (e) => {
  const payload = JSON.parse(e.data);

  switch (payload.type) {
    case "INIT": // basic connection info. you MUST send back a ready event to start receiving data.
      ws.send(JSON.stringify({type: "READY"}));
      console.log("init");
      break;

    case "PING": // Keep alive mechanism.
      ws.send(JSON.stringify({type: "PONG"}));
      break;

    case "KOI_STATICS":
      const { history, viewers, viewerCounts, userStates, streamStates, roomStates, features } = payload.data;
      // History is an array of events, you can use this to repopulate your widget with the current message history.
      // For the others, these are mapped by platform. so `viewerCounts.TWITCH` would be `123` or whatever. console.log is your friend.
      break;

    case "KOI":
      const event = payload.data;
      console.log(event);
      // same event format as before :^)
      break;

    case "MUSIC": // information from music providers, like the currently playing song on spotify
      break;

    case "APP":
    case "APPEARANCE": // Ignore, irrelevant for your usecase.
      break;
  }
};