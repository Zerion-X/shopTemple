import { create } from "zustand";

interface UserQuery {
  searchText?:string;
}

interface UserQueryStore {
  userQuery: UserQuery;
  setSearchText:(searchText:string) => void;
}

const useUserQueryStore = create<UserQueryStore>((set) => ({
  userQuery: {},
  
    setSearchText:(searchText) => set((store) => ({
        userQuery: {
        ...store.userQuery,
        searchText,
      }    
    }))
}));

export default useUserQueryStore;