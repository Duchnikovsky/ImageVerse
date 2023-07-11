import Button from '@/components/Button';
import { getAuthSession } from '@/lib/auth';
import CSS from '@/styles/home.module.css'

export default async function Home() {
  const session = await getAuthSession()
  return (
    <>
      <div className={CSS.grid}>
        {/*feed */}
        <div></div>
        <div></div>
        
        {session?.user && <div className={CSS.userBox}>
          <div className={CSS.nameBox}>
            <p className={CSS.name}>
              {session?.user.name}
            </p>
          </div>
          <div className={CSS.description}>
          Share your experiences with friends and followers by adding new posts
          </div>
          <div className={CSS.buttonBox}>
            <Button width={240} height={34} isDisabled={false} isLoading={false} text='Create new post'/>
          </div>
        </div>}
      </div>
    </>
  );
}
