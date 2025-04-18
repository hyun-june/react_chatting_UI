import { useEffect, useRef } from "react";

const UseCam = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getMedia = async (content) => {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(content);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Media 권한 오류:", err);
      }
    };
    getMedia({ video: true, audio: true });
  }, []);
  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // 자기 목소리 들리지 않게 음소거
      />
    </div>
  );
};

export default UseCam;
