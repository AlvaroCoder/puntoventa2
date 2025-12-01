'use client'
import { getSession } from "@/lib/authentication";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
export function useSession() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataSession, setDataSession] = useState(null);
    useEffect(()=>{ 
        async function getSessionData() {
        try {
            const session = await getSession();
            setDataSession(session);

        } catch (err) {
            setError(err);
        }   finally {
            setLoading(false);
        }
        
        }
        getSessionData();

    },[]);
    return {dataSession, loading, error}
}
// Sirve de fetch solo para metodos "GET"
export function useFetch(URL="") {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    useEffect(()=>{
        async function fetchData() {
            try {
                const session = await getSession();                
                const response = await fetch(URL,{
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${session?.access_token}`
                    },
                    method : 'GET',
                    mode : 'cors'
                });
                if (!response.ok) {
                    const jsonResponse = await response.json();
                    setError(jsonResponse?.message);
                    return;
                }
                const jsonResponse = await response.json();
                setData(jsonResponse);

            } catch (err) {
                
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[URL]);
    return {data, loading, error}
}