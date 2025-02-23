import bcrypt from 'bcrypt';


export const hashString = async (str: string) => {
    const saltRounds = 10 
    const hashedStr = await bcrypt.hash(str, saltRounds)
    return hashedStr
}



export const verifyHash = async (string: string, hash: string) => {
    const isMatch = await bcrypt.compare(string, hash)
    return isMatch
}