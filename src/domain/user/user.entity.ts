export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum Gender {
  MALE = "ຊາຍ",
  FEMALE = "ຍິງ",
  OTHER = "ອື່ນໆ",
}

export enum LanguageLevel {
  NONE = "ບໍ່ມີ",
  BASIC = "ພື້ນຖານ",
  INTERMEDIATE = "ປານາງກາງ",
  ADVANCED = "ຂັ້ນສູງ",
  NATIVE = "ພາສາແມ່",
}

export enum EducationLevel {
  HIGH_SCHOOL = "ມັດທະຍົມສືກສາ",
  VOCATIONAL = "ວິຊາຊີບ",
  DIPLOMA = "ປະລິນຍາຕີ",
  BACHELOR = "ປະລິນຍາຕີ",
  MASTER = "ປະລິນຍາໂທ",
  PHD = "ປະລິນຍາເອກ",
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
