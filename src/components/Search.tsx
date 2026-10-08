import Image from "./Image"

const Search = () => {
  return (
    <div className='bg-inputGray py-2 px-4 flex items-center gap-4 rounded-full transition-all focus-within:ring-1 focus-within:ring-iconBlue/60 animate-slideInRight'>
      <Image path="icons/explore.svg" alt="search" w={16} h={16}/>
      <input type="text" placeholder="Search" className="bg-transparent outline-none placeholder:text-textGray flex-1 min-w-0"/>
    </div>
  )
}

export default Search