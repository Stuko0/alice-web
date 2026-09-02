import storiesData from "../../public/data/user-stories.json";

export type StorySource =
  | "discord"
  | "x"
  | "github"
  | "blog"
  | "youtube"
  | "reddit"
  | "gist"
  | "hn"
  | "linkedin"
  | "podcast"
  | "producthunt";

export interface UserStory {
  id: string;
  author: string;
  headline: string;
  quote: string;
  url: string;
  source: StorySource;
  date: string;
  category: string;
}

interface StoriesFile {
  totalStories: number;
  stories: UserStory[];
}

const data = storiesData as StoriesFile;

export function getStories(): UserStory[] {
  return data.stories;
}

export function getTotalStories(): number {
  return data.totalStories;
}

export function sourceLabel(source: string): string {
  switch (source) {
    case "discord":
      return "Discord";
    case "x":
      return "X";
    case "github":
      return "GitHub";
    case "hn":
      return "Hacker News";
    default:
      return source.charAt(0).toUpperCase() + source.slice(1);
  }
}
