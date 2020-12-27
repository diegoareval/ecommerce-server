import bcrypt from "bcrypt"

export default class PasswordSecurity {
    hash(password: string): string{
        return bcrypt.hashSync(password, 10)
    }

    compareHashedPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

