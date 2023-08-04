"use client";

import CSS from "@/styles/searchbar.module.css";
import { Prisma, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

export default function Searchbar() {
  const [value, setValue] = useState<string>("");

  const {
    data: queryResults,
    refetch,
    isFetched,
    fetchStatus,
  } = useQuery({
    queryFn: async () => {
      if (!value) return [];

      const { data } = await axios.get(`/api/search?q=${value}`);
      return data as (User & {
        _count: Prisma.UserCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <div className={CSS.main}>
      <div className={CSS.inputArea}>
        <Search size={18} />
        <input
          className={CSS.input}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debounceRequest();
          }}
          placeholder="Search for users"
          spellCheck={false}
        ></input>
      </div>
      {value.length > 0 ? (
        <div className={CSS.results}>
          {fetchStatus === "fetching" && (
            <div className={CSS.loadingArea}>
              <Loader2 size={24} className={CSS.loader} />
            </div>
          )}
          {isFetched && (
            <>
              {(queryResults?.length ?? 0) > 0 ? (
                <>
                  {queryResults?.map((user) => (
                    <Link href={`/profile/${user.id}`} key={user.id} className={CSS.result} onClick={() => setValue('')}>
                      <UserAvatar
                        key={user.id}
                        user={{ image: user.image, name: user.name }}
                        style="small"
                      />
                      {user.name}
                    </Link>
                  ))}
                </>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
