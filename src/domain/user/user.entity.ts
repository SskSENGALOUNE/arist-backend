export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum LanguageLevel {
  NONE = "NONE",
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  NATIVE = "NATIVE",
}

export enum EducationLevel {
  HIGH_SCHOOL = "HIGH_SCHOOL",
  VOCATIONAL = "VOCATIONAL",
  DIPLOMA = "DIPLOMA",
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  PHD = "PHD",
}

export enum GraduatedFrom {
  DOMESTIC = "DOMESTIC",
  ABROAD = "ABROAD",
}

export enum Country {
  LAOS = "LAOS",
  THAILAND = "THAILAND",
  VIETNAM = "VIETNAM",
  CHINA = "CHINA",
  CAMBODIA = "CAMBODIA",
  MYANMAR = "MYANMAR",
  MALAYSIA = "MALAYSIA",
  SINGAPORE = "SINGAPORE",
  JAPAN = "JAPAN",
  SOUTH_KOREA = "SOUTH_KOREA",
  USA = "USA",
  UK = "UK",
  AUSTRALIA = "AUSTRALIA",
  FRANCE = "FRANCE",
  GERMANY = "GERMANY",
  RUSSIA = "RUSSIA",
  CANADA = "CANADA",
  OTHER = "OTHER",
}

export interface UserProfileData {
  photoUrl?: string | null;
  gender?: Gender | null;
  educationLevel?: EducationLevel | null;
  institutionName?: string | null;
  graduatedFrom?: GraduatedFrom | null;
  graduatedCountry?: Country | null;
  fieldOfStudy?: string | null;
  englishLevel?: LanguageLevel | null;
  vietnameseLevel?: LanguageLevel | null;
  chineseLevel?: LanguageLevel | null;
  otherLanguages?: string | null;
  passportExpiry?: Date | null;
}
