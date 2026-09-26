@dataclass
class Repo:
    name: str
    full_name: str
    url: str
    description: str = ""
    homepage: str = ""
    stars: int = 0
    forks: int = 0
    language: str = ""
    language_color: str = ""
    topics: List[str] = field(default_factory=list)
    pushed_at: str = ""
    archived: bool = False
    pinned: bool = False


@dataclass
class ProfileData:
    login: str
    name: str
    bio: str
    created_at: str  # ISO 8601
    followers: int
    following: int
    public_repos: int
    total_stars: int
    total_forks: int
    total_commits: int  # all-time commit contributions
    total_prs: int
    total_issues: int
    total_reviews: int
    contributed_to: int  # other people's repos contributed to
    total_contributions: int  # all-time, every contribution type
    last_year_contributions: int
    calendar: List[Day]  # rolling last year exactly as GitHub returns it: oldest first, weeks start on Sunday
    current_streak: Streak
    longest_streak: Streak
    first_contribution: Optional[str]
    languages: List[Language]
    featured: List[Repo]
    generated_at: str  # ISO 8601 UTC

    def to_json(self) -> dict:
        return asdict(self)

    @classmethod
    def from_json(cls, raw: dict) -> "ProfileData":
        raw = dict(raw)
        raw["calendar"] = [Day(**d) for d in raw["calendar"]]
        raw["current_streak"] = Streak(**raw["current_streak"])
        raw["longest_streak"] = Streak(**raw["longest_streak"])
        raw["languages"] = [Language(**lang) for lang in raw["languages"]]
        raw["featured"] = [Repo(**r) for r in raw["featured"]]
        return cls(**raw)


@dataclass
class Context:
    """Everything a card renderer may read. Cards must not do I/O."""

    config: "Config"
    theme: "Theme"
    data: Optional[ProfileData]
    icons: "IconStore"
    today: date
