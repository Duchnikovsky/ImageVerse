import CSS from "@/styles/NavbarStyles/searchbar.module.scss";
import debounce from "lodash.debounce";
import { FaDeleteLeft } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TbLoader3 } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, User } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { IoRemoveCircleOutline } from "react-icons/io5";

interface NavbarSearchbarProps {
  toggleSearch: () => void;
}

interface HistoryUserTypes {
  id: string;
  image: string;
  username: string;
  name: string;
}

async function fetchUsers(value: string) {
  if (!value) return [];

  const url = `/api/search?q=${value}`;
  const { data } = await axios.get(url);
  return data as (User & {
    _count: Prisma.UserCountOutputType;
  })[];
}

export default function NavbarSearchbar({
  toggleSearch,
}: NavbarSearchbarProps) {
  const [value, setValue] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<HistoryUserTypes[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }

    console.log(storedHistory);
  }, []);

  const addUserToHistory = (user: HistoryUserTypes) => {
    const isUserInHistory = searchHistory.some(
      (historyUser) => historyUser.id === user.id
    );

    if (!isUserInHistory) {
      const updatedHistory = [
        ...searchHistory,
        {
          id: user.id!,
          username: user.username!,
          name: user.name!,
          image: user.image!,
        },
      ];
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  };

  const { data, refetch, isFetching, isLoading, isRefetching } = useQuery({
    queryFn: () => fetchUsers(value),
    queryKey: ["search-query"],
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const users = data || [];

  let loading = isFetching || isLoading || isRefetching;

  return (
    <>
      <form className={CSS.form}>
        <CiSearch
          size={18}
          className={CSS.searchIcon}
          strokeWidth={1}
          color="gray"
        />
        {value.length > 0 && (
          <FaDeleteLeft
            size={18}
            className={CSS.clearIcon}
            strokeWidth={1}
            color="gray"
            onClick={() => {
              setValue("");
              debounceRequest();
            }}
          />
        )}
        <input
          type="text"
          placeholder="Search for users"
          className={CSS.input}
          spellCheck={false}
          maxLength={50}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debounceRequest();
          }}
        />
      </form>
      <div className={CSS.results}>
        {loading ? (
          <div className={CSS.loader}>
            <TbLoader3 size={32} strokeWidth={1} className={CSS.loaderIcon} />
          </div>
        ) : (
          <>
            {users.length === 0 && value.length === 0 && (
              <>
                <span className={CSS.searchHistoryTitle}>Search history</span>
                {searchHistory.reverse().map((user: HistoryUserTypes) => (
                  <Link
                    href={`/profile/${user.id}`}
                    key={user.id}
                    className={CSS.user}
                  >
                    <UserAvatar user={user} style="medium" />
                    <div className={CSS.userDetails}>
                      <span className={CSS.username}>{user.username}</span>
                      <span className={CSS.name}>{user.name}</span>
                    </div>
                    <IoRemoveCircleOutline
                      size={24}
                      className={CSS.removeHistory}
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedHistory = searchHistory.filter(
                          (historyUser) => historyUser.id !== user.id
                        );
                        setSearchHistory(updatedHistory);
                        localStorage.setItem(
                          "searchHistory",
                          JSON.stringify(updatedHistory)
                        );
                      }}
                    />
                  </Link>
                ))}
              </>
            )}
            {users.map((user: User) => (
              <Link
                href={`/profile/${user.id}`}
                key={user.id}
                className={CSS.user}
                onMouseDown={() => {
                  setValue("");
                  addUserToHistory({
                    id: user.id!,
                    username: user.username!,
                    name: user.name!,
                    image: user.image!,
                  });
                }}
              >
                <UserAvatar user={user} style="medium" />
                <div className={CSS.userDetails}>
                  <span className={CSS.username}>{user.username}</span>
                  <span className={CSS.name}>{user.name}</span>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
}
