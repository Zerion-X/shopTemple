import { create } from "zustand";

interface UserQuery {
  isUserLoggedIn: boolean;
  searchText?:string;
}

interface UserQueryStore {
  userQuery: UserQuery;
  setIsUserLoggedIn: (isLoggedIn: boolean) => void;
  setSearchText:(searchText:string) => void;
}

const useUserQueryStore = create<UserQueryStore>((set) => ({
  userQuery: {
    isUserLoggedIn: true,
  },
  setIsUserLoggedIn: (isLoggedIn) =>
    set((store) => ({
      userQuery: { ...store.userQuery, isUserLoggedIn: isLoggedIn },
    })),
    setSearchText:(searchText) => set((store) => ({
        userQuery:{isUserLoggedIn:store.userQuery.isUserLoggedIn,searchText}        
    }))
}));

export default useUserQueryStore;