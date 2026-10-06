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
          <div className="px-2 xsm:px-4 xxl:px-8 ">
            <LeftBar user={currentUser} />
          </div>
          <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray ">
            {children}
            {modal}
          </div>
          <div className="hidden lg:flex ml-4 md:ml-8 flex-1 ">
            <RightBar />
          </div>
        </div>
      </body>
    </html>
  );
}
