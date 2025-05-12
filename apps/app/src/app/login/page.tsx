import { Music, Video, MessageCircle } from "lucide-react";
import Image from "next/image";
import LoginButton from "./_login-button";

export default function Page() {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white">
      <div className="relative w-full max-w-md overflow-hidden">
        <div className="px-8 pt-8 pb-6 flex flex-col text-center items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Collect Moments,
            <br /> <span className="line-through">Not Merch</span>
          </h1>

          <div className="relative w-64 h-64 mb-8">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#FF3030] flex items-center justify-center">
              <span className="text-white text-4xl font-bold">e</span>
            </div>

            <div className="absolute left-[15%] top-[20%] w-10 h-10 rounded-full bg-[#5de0c8] flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>

            <div className="absolute right-[15%] top-[20%] w-10 h-10 rounded-full bg-[#7b68ee] flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>

            <div className="absolute left-[10%] bottom-[30%] w-10 h-10 rounded-full bg-[#ff6b81] flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>

            <div className="absolute right-[10%] bottom-[30%] w-10 h-10 rounded-full bg-[#ffa502] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>

            <div className="absolute left-[30%] top-[70%] w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-25.webp"
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <div className="absolute left-[30%] top-[10%] w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-3.webp"
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>

            <div className="absolute right-[30%] top-[10%] w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-7.webp"
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>

          <LoginButton />

          {/* <InstallButton /> */}
        </div>
      </div>
    </div>
  );
}
