import { createClient } from "@supabase/supabase-js"

const url="https://cerlqnpkljgprpjwwfnb.supabase.co"
const key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmxxbnBrbGpncHJwand3Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTE4MTIsImV4cCI6MjA2NzUyNzgxMn0.zUHXfAAuMDxmO79-epkBXu71i9yemcwnlUbzQQAkiEA"

const supabase = createClient(url,key)

export default function mediaUpload(file){
    const mediaUploadPromise = new Promise(
        (resolve,reject)=>{
            if(file==null){
                reject("No file selected")
                return
            }

            const timestamp = new Date().getTime()
            const newname = timestamp+file.name

            supabase.storage.from("images").upload(newname,file,{
                upsert:false,
                cacheControl: '3600'
            }).then(
                ()=>{
                    const publicUrl = supabase.storage.from("images").getPublicUrl(newname).data.publicUrl
                    // console.log(publicUrl)
                    resolve(publicUrl)
                }
            ).catch(
                (e)=>{
                    // console.log(e)
                    reject("Error occured in supabase")
                }
            )
        }

    )

    return mediaUploadPromise
}