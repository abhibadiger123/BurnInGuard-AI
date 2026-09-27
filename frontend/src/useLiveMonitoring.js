import {
  useEffect,
  useRef,
  useState,
} from "react";


function useLiveMonitoring(componentId) {

  const socketRef =
    useRef(null);


  const [liveReading, setLiveReading] =
    useState(null);


  const [liveReadings, setLiveReadings] =
    useState([]);


  const [isConnected, setIsConnected] =
    useState(false);


  const [error, setError] =
    useState("");


  useEffect(() => {

    if (!componentId) {

      setLiveReading(null);

      setLiveReadings([]);

      setIsConnected(false);

      setError("");

      return;
    }


    const socket =
      new WebSocket(
        `ws://127.0.0.1:8000/ws/monitor/${componentId}`
      );


    socketRef.current =
      socket;


    socket.onopen = () => {

      console.log(
        "Live monitoring connected"
      );

      setIsConnected(true);

      setError("");

    };


    socket.onmessage = (event) => {

      try {

        const data =
          JSON.parse(
            event.data
          );


        if (
          data.type === "reading"
        ) {

          console.log(
            "Live reading:",
            data
          );

          console.log(
            "Live AI:",
            data.ai
          );


          setLiveReading(
            data
          );


          setLiveReadings(
            (previous) => {

              const updated = [
                ...previous,
                data,
              ];


              return updated.slice(
                -30
              );

            }
          );

        }


        if (
          data.type === "error"
        ) {

          setError(
            data.message ||
            "Live monitoring error"
          );

        }

      }

      catch (error) {

        console.error(
          "WebSocket message error:",
          error
        );

      }

    };


    socket.onerror = () => {

      console.error(
        "WebSocket connection error"
      );


      setError(
        "Unable to connect to live monitoring."
      );


      setIsConnected(false);

    };


    socket.onclose = () => {

      console.log(
        "Live monitoring disconnected"
      );


      setIsConnected(false);

    };


    return () => {

      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {

        socket.close();

      }

      else if (
        socket.readyState ===
        WebSocket.CONNECTING
      ) {

        socket.close();

      }


      socketRef.current =
        null;

    };

  }, [componentId]);


  return {

    liveReading,

    liveReadings,

    isConnected,

    error,

  };

}


export default useLiveMonitoring;