export interface Project {
  id: string;
  title: string;
  cover: string;
  pictures: string[];
  tags: string[];
  description: string;
  link?: string;
  linkGH: string;
}

export interface Skill {
  id: string;
  name: string;
  image: string;
  tags: string[];
  description:string;
}
