import LeftBar from "@/components/LeftBar";
import "./globals.css";
import RightBar from "@/components/RightBar";
import { getCurrentUser } from "@/lib/fakeApi";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vert San X Clone',
  description: 'Next.js social media application project',
}

export default async function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
          <div className="px-2 xsm:px-4 xxl:px-6 shrink-0">
            <LeftBar user={currentUser} />
          </div>
          <div className="flex-1 min-w-0 border-x-[1px] border-borderGray ">
            {children}
            {modal}
          </div>
          <div className="hidden lg:flex shrink-0 ml-4 md:ml-8 w-[300px] xl:w-[330px] xxl:w-[350px]">
            <RightBar />
          </div>
        </div>
      </body>
    </html>
  );
}
