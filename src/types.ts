export type GameId = 
  | 'runner'
  | 'knife'
  | 'golf'
  | 'basket'
  | 'helix'
  | 'drift'
  | 'stack'
  | 'flappy'
  | 'fruitslice'
  | 'tictactoe'
  | 'sudoku'
  | 'memory'
  | 'math'
  | 'pattern'
  | 'shadow'
  | 'colors'
  | 'logic'
  | 'word'
  | 'bubble'
  | 'snake'
  | 'dino'
  | 'whack'
  | 'piano'
  | 'balloon'
  | 'connect4'
  | 'cardflip'
  | 'rhymes'
  | 'subwaysurf'
  | 'crossyroad'
  | 'spaceinvaders'
  | 'motox3m'
  | 'brickbreaker'
  | 'jetpack'
  | 'slope3d'
  | 'tunnelrush3d';

export type Language = 'en' | 'hi';

export type GameCategoryGroup = 'all' | 'mind' | 'fun' | 'learning';

export type GradeLevel = 
  | 'pre_nursery' // Ages 2-3
  | 'nursery_kg'  // Ages 4-5
  | 'primary_1_3' // Ages 6-8 (Std 1-3)
  | 'middle_4_8'  // Ages 9-13 (Std 4-8)
  | 'teens_9_12'; // Ages 14-17 (Std 9-12 / Teens below 18)

export interface PlayerProfile {
  name: string;
  avatar: string;
  totalStars: number;
  unlockedBadges: string[];
  soundEnabled: boolean;
  selectedGrade: 'all' | GradeLevel;
  gameStats: {
    memoryBestMoves: number;
    mathHighScore: number;
    patternBestRound: number;
    shadowCompleted: number;
    colorsCompleted: number;
    logicScore: number;
    wordScore: number;
    runnerHighScore: number;
    knifeHighScore: number;
    golfHighScore: number;
    stackHighScore: number;
    basketHighScore: number;
    helixHighScore: number;
    driftHighScore: number;
    flappyHighScore?: number;
    fruitsliceHighScore?: number;
    tictactoeWins?: number;
    sudokuCompleted?: number;
    frogHighScore?: number;
    riverCompleted?: number;
    slopeHighScore?: number;
    tunnelHighScore?: number;
  };
}

export interface Badge {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: string;
  requirement: string;
}

export interface GameInfo {
  id: GameId;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  categoryEn: string;
  categoryHi: string;
  categoryGroup: 'mind' | 'fun' | 'learning' | 'sports';
  icon: string;
  accentColor: string;
  bgGradient: string;
  starRequirement: number;
  gradeLevels: GradeLevel[]; // Suitable grades for below 18
  recommendedAge: string;
  ageLabelHi: string;
}
