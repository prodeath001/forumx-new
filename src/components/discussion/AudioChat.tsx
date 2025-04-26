import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// Types
interface AudioChatProps {
  discussionId: string;
}

declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

const AudioChat: React.FC<AudioChatProps> = ({ discussionId }) => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load ZegoCloud script
    const loadZegoScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.ZegoUIKitPrebuilt) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load ZegoCloud SDK"));
        document.body.appendChild(script);
      });
    };

    const initializeZegoCloud = async () => {
      try {
        await loadZegoScript();
        
        if (!containerRef.current || !window.ZegoUIKitPrebuilt) return;
        
        const roomID = discussionId;
        const userID = user?._id || Math.floor(Math.random() * 10000).toString();
        const userName = user?.username || "Guest";
        const appID = 1197356487;
        const serverSecret = "ae07d4117925b5e2d80c7ccb654eb4a6";
        
        const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID, 
          serverSecret, 
          roomID, 
          userID, 
          userName
        );
        
        const zp = window.ZegoUIKitPrebuilt.create(kitToken);
        
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [{
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          }],
          scenario: {
            mode: window.ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Grid",
          showLayoutButton: true,
        });
      } catch (error) {
        console.error("Error initializing ZegoCloud:", error);
      }
    };

    initializeZegoCloud();
    
    // Cleanup
    return () => {
      const zegoScript = document.querySelector('script[src="https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js"]');
      if (zegoScript) {
        zegoScript.remove();
      }
    };
  }, [discussionId, user]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 p-2 bg-secondary/30 rounded-md">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span className="font-medium">Video Conference</span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full rounded-md overflow-hidden"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default AudioChat;