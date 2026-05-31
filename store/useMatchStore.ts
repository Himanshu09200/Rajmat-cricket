import { create } from 'zustand';

export type DeliveryType = 'legal' | 'wide' | 'noBall' | 'bye' | 'legBye';
export type WicketType = 'bowled' | 'caught' | 'runOut' | 'lbw' | 'stumped' | 'hitWicket' | 'handledBall' | 'obstructingField' | 'timedOut' | 'retiredHurt';

export interface Player {
  id: string;
  name: string;
  image?: any;
  isCaptain?: boolean;
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
  strikerName?: string;
  bowlerName?: string;
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
  openersSelected: boolean;
  dismissedBatsmen: string[];
  needsNewBatsman: boolean;
  needsNewBowler: boolean;

  // Match Flow
  targetScore: number;
  matchStatus: 'ongoing' | 'inningsBreak' | 'completed';
  matchResult: string;

  // 1st Innings Snapshot (preserved after transition)
  innings1Deliveries: Delivery[];
  innings1Runs: number;
  innings1Wickets: number;
  innings1Overs: number;
  innings1Balls: number;
  innings1BattingTeam: string;
  innings1BowlingTeam: string;
  innings1DismissedBatsmen: string[];

  // Player management
  addPlayer: (team: 'team1' | 'team2', name: string) => void;
  removePlayer: (team: 'team1' | 'team2', playerId: string) => void;
  updatePlayer: (team: 'team1' | 'team2', playerId: string, name: string, image?: any) => void;
  setPlayerCount: (team: 'team1' | 'team2', count: number) => void;
  setCaptain: (team: 'team1' | 'team2', playerId: string) => void;

  // Match actions
  setupMatch: (team1: string, team2: string, tossWinner: string, optTo: 'bat' | 'bowl', totalOvers: number) => void;
  setOpeners: (striker: string, nonStriker: string) => void;
  setNextBatsman: (playerName: string) => void;
  setBowler: (playerName: string) => void;
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
  openersSelected: false,
  dismissedBatsmen: [],
  needsNewBatsman: false,
  needsNewBowler: true,

  targetScore: 0,
  matchStatus: 'ongoing',
  matchResult: '',

  innings1Deliveries: [],
  innings1Runs: 0,
  innings1Wickets: 0,
  innings1Overs: 0,
  innings1Balls: 0,
  innings1BattingTeam: '',
  innings1BowlingTeam: '',
  innings1DismissedBatsmen: [],

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

  setCaptain: (team, playerId) => set((state) => {
    const key = team === 'team1' ? 'team1Players' : 'team2Players';
    return {
      [key]: state[key].map((p) => ({
        ...p,
        isCaptain: p.id === playerId,
      })),
    };
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
    openersSelected: false,
    needsNewBowler: true,
  })),

  setOpeners: (striker, nonStriker) => set({
    striker,
    nonStriker,
    openersSelected: true,
  }),

  setNextBatsman: (playerName) => set((state) => {
    // If the striker is empty, they take the striker's end. 
    // If non-striker is empty, they take the non-striker's end.
    return {
      striker: state.striker === '' ? playerName : state.striker,
      nonStriker: state.nonStriker === '' ? playerName : state.nonStriker,
      needsNewBatsman: false,
    };
  }),

  setBowler: (playerName) => set({
    bowler: playerName,
    needsNewBowler: false,
  }),

  addDelivery: (runs, type, isWicket, extras = 0, wicketType) =>
    set((state) => {
      if (state.matchStatus !== 'ongoing') {
        return state;
      }

      const battingPlayers = state.battingTeam === state.team1 ? state.team1Players : state.team2Players;
      const maxWickets = battingPlayers.length; // SOLO MODE: All players can bat.

      if (state.wickets >= maxWickets || state.overs >= state.totalOvers) {
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
        strikerName: state.striker,
        bowlerName: state.bowler,
      };

      const newDeliveries = [...state.deliveries, delivery];
      let newMatchStatus: MatchState['matchStatus'] = state.matchStatus;
      let newMatchResult = state.matchResult;
      let newTargetScore = state.targetScore;

      // Check for 2nd innings win by chasing team
      if (state.currentInnings === 2 && newRuns >= state.targetScore) {
        newMatchStatus = 'completed';
        newMatchResult = `${state.battingTeam} won by ${maxWickets - newWickets} wickets`;
      } 
      // Check if innings is over (all out or overs completed)
      else if (newWickets >= maxWickets || (newOvers >= state.totalOvers && newBalls === 0)) {
        if (state.currentInnings === 1) {
          newMatchStatus = 'inningsBreak';
          newTargetScore = newRuns + 1;
        } else {
          newMatchStatus = 'completed';
          if (newRuns >= state.targetScore) {
             newMatchResult = `${state.battingTeam} won by ${maxWickets - newWickets} wickets`;
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
        needsNewBowler: (isLegal && newBalls === 0 && newOvers > state.overs),
        // Strike rotation logic
        ...(() => {
          let currentStriker = state.striker;
          let currentNonStriker = state.nonStriker;
          let dismissed = [...state.dismissedBatsmen];
          let needsNew = false;

          // If wicket fell, dismiss the striker
          if (isWicket) {
            dismissed.push(currentStriker);
            
            // Solo Mode Check: If only 1 player remains
            if (newWickets >= maxWickets - 1) {
              needsNew = false;
              // The non-striker becomes the sole striker
              currentStriker = currentNonStriker;
              currentNonStriker = '';
            } else {
              needsNew = true;
              // Don't rotate on wicket - new batsman will replace striker
              // But still check for end of over swap
              if (isLegal && newBalls === 0 && newOvers > state.overs) {
                // End of over: non-striker goes to striker end
                currentStriker = currentNonStriker;
                currentNonStriker = ''; // will be replaced by new batsman
              } else {
                currentStriker = ''; // will be replaced by new batsman
              }
            }
          } else {
            // Determine runs for strike rotation
            const runsForRotation = type === 'wide' ? 0 : runs;

            // Swap on odd runs (only if non-striker exists)
            if (runsForRotation % 2 === 1 && currentNonStriker !== '') {
              [currentStriker, currentNonStriker] = [currentNonStriker, currentStriker];
            }

            // Swap at end of over (after 6 legal balls, only if non-striker exists)
            if (isLegal && newBalls === 0 && newOvers > state.overs && currentNonStriker !== '') {
              [currentStriker, currentNonStriker] = [currentNonStriker, currentStriker];
            }
          }

          return {
            striker: currentStriker,
            nonStriker: currentNonStriker,
            dismissedBatsmen: dismissed,
            needsNewBatsman: needsNew,
          };
        })(),
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
      const battingPlayers = state.battingTeam === state.team1 ? state.team1Players : state.team2Players;
      const maxWickets = battingPlayers.length; // SOLO MODE

      if (state.currentInnings === 1 && state.matchStatus === 'ongoing') {
        return {
          matchStatus: 'inningsBreak',
          targetScore: state.runs + 1,
        };
      } else if (state.currentInnings === 2 && state.matchStatus === 'ongoing') {
        let result = '';
        if (state.runs >= state.targetScore) {
          result = `${state.battingTeam} won by ${maxWickets - state.wickets} wickets`;
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
          // Snapshot the 1st innings data
          innings1Deliveries: state.deliveries,
          innings1Runs: state.runs,
          innings1Wickets: state.wickets,
          innings1Overs: state.overs,
          innings1Balls: state.balls,
          innings1BattingTeam: state.battingTeam,
          innings1BowlingTeam: state.bowlingTeam,
          innings1DismissedBatsmen: state.dismissedBatsmen,
          // Reset for 2nd innings
          currentInnings: 2,
          battingTeam: state.bowlingTeam,
          bowlingTeam: state.battingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          deliveries: [],
          dismissedBatsmen: [],
          matchStatus: 'ongoing',
          openersSelected: false,
          needsNewBowler: true,
          needsNewBatsman: false,
          striker: '',
          nonStriker: '',
        };
      }
      return state;
    }),

  resetMatch: () =>
    set({
      matchStarted: false,
      openersSelected: false,
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
      needsNewBowler: true,
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
