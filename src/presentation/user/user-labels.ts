import {
  Country,
  EducationLevel,
  Gender,
  GraduatedFrom,
  LanguageLevel,
  UserRole,
} from '../../domain/user/user.entity';

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'ຜູ້ດູແລລະບົບ',
  [UserRole.EMPLOYEE]: 'ພະນັກງານ',
};

export const GenderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'ຊາຍ',
  [Gender.FEMALE]: 'ຍິງ',
};

export const EducationLevelLabels: Record<EducationLevel, string> = {
  [EducationLevel.HIGH_SCHOOL]: 'ມັດທະຍົມປາຍ',
  [EducationLevel.VOCATIONAL]: 'ອາຊີວະສຶກສາ',
  [EducationLevel.DIPLOMA]: 'ປະກາສະນີຍະບັດຊັ້ນສູງ',
  [EducationLevel.BACHELOR]: 'ປະລິນຍາຕີ',
  [EducationLevel.MASTER]: 'ປະລິນຍາໂທ',
  [EducationLevel.PHD]: 'ປະລິນຍາເອກ',
};

export const GraduatedFromLabels: Record<GraduatedFrom, string> = {
  [GraduatedFrom.DOMESTIC]: 'ພາຍໃນປະເທດ',
  [GraduatedFrom.ABROAD]: 'ຕ່າງປະເທດ',
};

export const LanguageLevelLabels: Record<LanguageLevel, string> = {
  [LanguageLevel.NONE]: 'ບໍ່ມີ',
  [LanguageLevel.BASIC]: 'ພື້ນຖານ',
  [LanguageLevel.INTERMEDIATE]: 'ປານກາງ',
  [LanguageLevel.ADVANCED]: 'ສູງ',
  [LanguageLevel.NATIVE]: 'ພາສາແມ່',
};

export const CountryLabels: Record<Country, string> = {
  [Country.LAOS]: 'ລາວ',
  [Country.THAILAND]: 'ໄທ',
  [Country.VIETNAM]: 'ຫວຽດນາມ',
  [Country.CHINA]: 'ຈີນ',
  [Country.CAMBODIA]: 'ກຳປູເຈຍ',
  [Country.MYANMAR]: 'ມຽນມາ',
  [Country.MALAYSIA]: 'ມາເລເຊຍ',
  [Country.SINGAPORE]: 'ສິງກະໂປ',
  [Country.JAPAN]: 'ຍີ່ປຸ່ນ',
  [Country.SOUTH_KOREA]: 'ເກົາຫຼີໃຕ້',
  [Country.USA]: 'ສະຫະລັດອາເມລິກາ',
  [Country.UK]: 'ອັງກິດ',
  [Country.AUSTRALIA]: 'ອອສເຕຣເລຍ',
  [Country.FRANCE]: 'ຝຣັ່ງ',
  [Country.GERMANY]: 'ເຢຍລະມັນ',
  [Country.RUSSIA]: 'ລັດເຊຍ',
  [Country.CANADA]: 'ການາດາ',
  [Country.OTHER]: 'ອື່ນໆ',
};
