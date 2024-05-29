import OccasionForm from "@/components/form";

async function HomePage() {
  return (
    <>
      <div className='flex flex-col w-screen h-full items-center justify-center '>
        <img src='/Header.svg' className='p-8 w-[75%]' />
        <div className='flex w-3/4 h-3/4 bg-secondary p-8 border-2 border-primary rounded-lg justify-center'>
          <OccasionForm />
        </div>
      </div>
    </>
  );
}

export default HomePage;
