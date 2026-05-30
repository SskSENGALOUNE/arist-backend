export class Banner {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly subtitle: string | null,
    public readonly imageUrl: string | null,
    public readonly isActive: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date,
    public readonly createdBy: string,
    public readonly updatedAt: Date,
    public readonly updatedBy: string,
  ) {}

  static create(
    props: {
      title: string;
      subtitle?: string | null;
      imageUrl?: string | null;
      isActive?: boolean;
      sortOrder?: number;
    },
    createdBy: string,
  ): {
    title: string;
    subtitle: string | null;
    imageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdBy: string;
    updatedBy: string;
  } {
    return {
      title: props.title,
      subtitle: props.subtitle ?? null,
      imageUrl: props.imageUrl ?? null,
      isActive: props.isActive ?? true,
      sortOrder: props.sortOrder ?? 0,
      createdBy,
      updatedBy: createdBy,
    };
  }

  static reconstitute(
    id: string,
    title: string,
    subtitle: string | null,
    imageUrl: string | null,
    isActive: boolean,
    sortOrder: number,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
  ): Banner {
    return new Banner(
      id,
      title,
      subtitle,
      imageUrl,
      isActive,
      sortOrder,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
    );
  }

  update(
    props: {
      title?: string;
      subtitle?: string | null;
      imageUrl?: string | null;
      isActive?: boolean;
      sortOrder?: number;
    },
    updatedBy: string,
  ): {
    title?: string;
    subtitle?: string | null;
    imageUrl?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    updatedBy: string;
  } {
    return {
      ...(props.title !== undefined ? { title: props.title } : {}),
      ...(props.subtitle !== undefined ? { subtitle: props.subtitle } : {}),
      ...(props.imageUrl !== undefined ? { imageUrl: props.imageUrl } : {}),
      ...(props.isActive !== undefined ? { isActive: props.isActive } : {}),
      ...(props.sortOrder !== undefined ? { sortOrder: props.sortOrder } : {}),
      updatedBy,
    };
  }
}
