import React, { createContext, useState } from 'react'

type GlobalContextType = {
    isWriteModalOpen: boolean,
    setIsWriteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const GlobalContext = createContext<{
    isWriteModalOpen: boolean,
    setIsWriteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}>(null as unknown as GlobalContextType)
//we define it as unknown and then as GlobalContextType because null does not overlap 100% with GCT

 const GlobalContextProvider = ({children}: React.PropsWithChildren) => {

const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  return (
  <GlobalContext.Provider value={({isWriteModalOpen, setIsWriteModalOpen})}>
    {children}
  </GlobalContext.Provider>
  )
}

export default GlobalContextProvider