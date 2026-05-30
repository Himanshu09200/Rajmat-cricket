import { create } from 'zustand';

export type DeliveryType = 'legal' | 'wide' | 'noBall' | 'bye' | 'legBye';
export type WicketType = 'bowled' | 'caught' | 'runOut' | 'lbw' | 'stumped' | 'hitWicket' | 'handledBall' | 'obstructingField' | 'timedOut' | 'retiredHurt';

export interface Player {
  id: string;
  name: string;
  image?: any;
}

export interface Delivery {
  id: string;
  runs: number;
  extras: number;
  type: DeliveryType;
  isWicket: boolean;
  wicketType?: WicketType;
  overIndex: number;
  ballIndex: number;
}

export interface MatchState {
  // Match configuration
  team1: string;
  team2: string;
  team1Players: Player[];
  team2Players: Player[];
  tossWinner: string;
  optTo: 'bat' | 'bowl';
  totalOvers: number;
  matchStarted: boolean;

  // Current innings state
  currentInnings: 1 | 2;
  battingTeam: string;
  bowlingTeam: string;

  runs: number;
  wickets: number;
  overs: number;
  balls: number;

  deliveries: Delivery[];

  striker: string;
  nonStriker: string;
  bowler: string;

  // Match Flow
  targetScore: number;
  matchStatus: 'ongoing' | 'inningsBreak' | 'completed';
  matchResult: string;

  // Player management
  addPlayer: (team: 'team1' | 'team2', name: string) => void;
  removePlayer: (team: 'team1' | 'team2', playerId: string) => void;
  updatePlayer: (team: 'team1' | 'team2', playerId: string, name: string, image?: any) => void;
  setPlayerCount: (team: 'team1' | 'team2', count: number) => void;

  // Match actions
  setupMatch: (team1: string, team2: string, tossWinner: string, optTo: 'bat' | 'bowl', totalOvers: number) => void;
  addDelivery: (runs: number, type: DeliveryType, isWicket: boolean, extras?: number, wicketType?: WicketType) => void;
  undoLastDelivery: () => void;
  endInnings: () => void;
  startSecondInnings: () => void;
  resetMatch: () => void;
}

function createDefaultPlayers(count: number, prefix: string): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${Date.now()}-${i}`,
    name: `Player ${i + 1}`,
  }));
}

export const useMatchStore = create<MatchState>((set) => ({
  team1: '',
  team2: '',
  team1Players: createDefaultPlayers(11, 't1'),
  team2Players: createDefaultPlayers(11, 't2'),
  tossWinner: '',
  optTo: 'bat',
  totalOvers: 20,
  matchStarted: false,

  currentInnings: 1,
  battingTeam: '',
  bowlingTeam: '',

  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,

  deliveries: [],

  striker: 'Player 1',
  nonStriker: 'Player 2',
  bowler: 'Bowler 1',

  targetScore: 0,
  matchStatus: 'ongoing',
  matchResult: '',

  addPlayer: (team, name) => set((state) => {
    const key = team === 'team1' ? 'team1Players' : 'team2Players';
    const prefix = team === 'team1' ? 't1' : 't2';
    return {
      [key]: [...state[key], { id: `${prefix}-${Date.now()}`, name }],
    };
  }),

  removePlayer: (team, playerId) => set((state) => {
    const key = team === 'team1' ? 'team1Players' : 'team2Players';
    const players = state[key].filter((p) => p.id !== playerId);
    if (players.length < 2) return state; // minimum 2 players
    return { [key]: players };
  }),

  updatePlayer: (team, playerId, name, image) => set((state) => {
    const key = team === 'team1' ? 'team1Players' : 'team2Players';
    return {
      [key]: state[key].map((p) => (p.id === playerId ? { ...p, name, image: image !== undefined ? image : p.image } : p)),
    };
  }),

  setPlayerCount: (team, count) => set((state) => {
    const key = team === 'team1' ? 'team1Players' : 'team2Players';
    const prefix = team === 'team1' ? 't1' : 't2';
    const current = state[key];
    if (count < 2 || count > 15) return state;
    if (count > current.length) {
      const newPlayers = Array.from({ length: count - current.length }, (_, i) => ({
        id: `${prefix}-${Date.now()}-${current.length + i}`,
        name: `Player ${current.length + i + 1}`,
      }));
      return { [key]: [...current, ...newPlayers] };
    }
    return { [key]: current.slice(0, count) };
  }),

  setupMatch: (team1, team2, tossWinner, optTo, totalOvers) => set((state) => ({
    team1,
    team2,
    tossWinner,
    optTo,
    totalOvers,
    matchStarted: true,
    currentInnings: 1,
    battingTeam:
      tossWinner === team1 && optTo === 'bat'
        ? team1
        : tossWinner === team2 && optTo === 'bat'
        ? team2
        : tossWinner === team1 && optTo === 'bowl'
        ? team2
        : team1,
    bowlingTeam:
      tossWinner === team1 && optTo === 'bat'
        ? team2
        : tossWinner === team2 && optTo === 'bat'
        ? team1
        : tossWinner === team1 && optTo === 'bowl'
        ? team1
        : team2,
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    deliveries: [],
    targetScore: 0,
    matchStatus: 'ongoing',
    matchResult: '',
  })),

  addDelivery: (runs, type, isWicket, extras = 0, wicketType) =>
    set((state) => {
      if (state.matchStatus !== 'ongoing') {
        return state;
      }

      if (state.wickets >= 10 || state.overs >= state.totalOvers) {
        return state;
      }

      const isLegal = type === 'legal' || type === 'bye' || type === 'legBye';

      let addedRuns = runs + extras;
      if (type === 'wide' || type === 'noBall') {
        addedRuns += 1;
      }

      const newRuns = state.runs + addedRuns;
      const newWickets = state.wickets + (isWicket ? 1 : 0);

      let newBalls = state.balls;
      let newOvers = state.overs;

      if (isLegal) {
        newBalls += 1;
        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }
      }

      const delivery: Delivery = {
        id: Date.now().toString(),
        runs,
        extras: extras + (type === 'wide' || type === 'noBall' ? 1 : 0),
        type,
        isWicket,
        wicketType,
        overIndex: state.overs,
        ballIndex: state.balls,
      };

      const newDeliveries = [...state.deliveries, delivery];
      let newMatchStatus: MatchState['matchStatus'] = state.matchStatus;
      let newMatchResult = state.matchResult;
      let newTargetScore = state.targetScore;

      // Check for 2nd innings win by chasing team
      if (state.currentInnings === 2 && newRuns >= state.targetScore) {
        newMatchStatus = 'completed';
        newMatchResult = `${state.battingTeam} won by ${10 - newWickets} wickets`;
      } 
      // Check if innings is over (all out or overs completed)
      else if (newWickets >= 10 || (newOvers >= state.totalOvers && newBalls === 0)) {
        if (state.currentInnings === 1) {
          newMatchStatus = 'inningsBreak';
          newTargetScore = newRuns + 1;
        } else {
          newMatchStatus = 'completed';
          if (newRuns >= state.targetScore) {
             newMatchResult = `${state.battingTeam} won by ${10 - newWickets} wickets`;
          } else if (newRuns === state.targetScore - 1) {
             newMatchResult = `Match Tied`;
          } else {
             newMatchResult = `${state.bowlingTeam} won by ${state.targetScore - 1 - newRuns} runs`;
          }
        }
      }

      return {
        runs: newRuns,
        wickets: newWickets,
        overs: newOvers,
        balls: newBalls,
        deliveries: newDeliveries,
        matchStatus: newMatchStatus,
        matchResult: newMatchResult,
        targetScore: newTargetScore,
      };
    }),

  undoLastDelivery: () =>
    set((state) => {
      if (state.deliveries.length === 0) return state;

      const newDeliveries = [...state.deliveries];
      const lastDelivery = newDeliveries.pop()!;

      let newBalls = state.balls;
      let newOvers = state.overs;

      const isLegal =
        lastDelivery.type === 'legal' ||
        lastDelivery.type === 'bye' ||
        lastDelivery.type === 'legBye';

      if (isLegal) {
        if (newBalls === 0 && newOvers > 0) {
          newOvers -= 1;
          newBalls = 5;
        } else {
          newBalls -= 1;
        }
      }

      return {
        runs: state.runs - (lastDelivery.runs + lastDelivery.extras),
        wickets: state.wickets - (lastDelivery.isWicket ? 1 : 0),
        overs: newOvers,
        balls: newBalls,
        deliveries: newDeliveries,
      };
    }),

  endInnings: () =>
    set((state) => {
      if (state.currentInnings === 1 && state.matchStatus === 'ongoing') {
        return {
          matchStatus: 'inningsBreak',
          targetScore: state.runs + 1,
        };
      } else if (state.currentInnings === 2 && state.matchStatus === 'ongoing') {
        let result = '';
        if (state.runs >= state.targetScore) {
          result = `${state.battingTeam} won by ${10 - state.wickets} wickets`;
        } else if (state.runs === state.targetScore - 1) {
          result = `Match Tied`;
        } else {
          result = `${state.bowlingTeam} won by ${state.targetScore - 1 - state.runs} runs`;
        }
        return {
          matchStatus: 'completed',
          matchResult: result,
        };
      }
      return state;
    }),

  startSecondInnings: () =>
    set((state) => {
      if (state.currentInnings === 1 && state.matchStatus === 'inningsBreak') {
        return {
          currentInnings: 2,
          battingTeam: state.bowlingTeam,
          bowlingTeam: state.battingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          deliveries: [],
          matchStatus: 'ongoing',
        };
      }
      return state;
    }),

  resetMatch: () =>
    set({
      matchStarted: false,
      team1: '',
      team2: '',
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      deliveries: [],
      targetScore: 0,
      matchStatus: 'ongoing',
      matchResult: '',
    }),
}));

/** Helper to get the display label for a delivery in the over timeline */
export function getDeliveryLabel(d: Delivery): string {
  if (d.isWicket) return 'W';
  switch (d.type) {
    case 'wide':
      return 'WD';
    case 'noBall':
      return d.runs > 0 ? `NB${d.runs}` : 'NB';
    case 'bye':
      return 'BYE';
    case 'legBye':
      return 'LB';
    default:
      return String(d.runs);
  }
}
