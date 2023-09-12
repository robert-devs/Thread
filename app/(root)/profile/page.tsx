import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


import ProfileHeader from "@/components/shared/ProfileHeader";

import { fetchUser } from "@/lib/actions/user.actions";

async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
        console.log(user);
    if (!user) return null;

    // console.log("User ID from params:", params.id)

    const userInfo = await fetchUser(params.id);
  
   if (userInfo && (userInfo.onboarded === undefined || userInfo.onboarded === false)) {
        redirect("/onboarding");
    }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-9'>
        
      </div>
    </section>
  );
}
export default Page;