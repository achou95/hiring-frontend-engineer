import React, { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import "./styles.css";
import { ReactComponent as CircleIcon } from "../circle.svg"
import { ReactComponent as UpIcon } from "../upArrow.svg"
import { ReactComponent as DownIcon } from "../downArrow.svg"
import { ReactComponent as ChevronDownIcon } from "../chevron-down.svg"
import { ReactComponent as ChevronUpIcon } from "../chevron-up.svg"

ChartJS.register(ArcElement, Tooltip, Legend);
// have dropdown show unique country
// have dropdown in right location and then send it in... taking too long on this
export interface PayloadCardProps {
  missions: {
    id: string;
    name: string;
    payloads: ({
        id: string;
        payload_mass_kg: null;
        nationality: string;
    } | {
        id: string;
        payload_mass_kg: number;
        nationality: string;
    } | null)[];
  }[]
}

export interface DoughtnutData {
  labels: string[],
  datasets: [
    {
      data: number[],
      backgroundColor: string[],
      cutout: string,
      radius: number
    }
  ]
}

// probably have legend in the table...probably easier to do it that way than somehow format the legend to be a part of the table
export const options: ChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const PayloadCard: React.FC<PayloadCardProps> = (props: PayloadCardProps) => {

  const selectedMissionData = () => {
    let missionsMass: { name: string; mass: number; }[] = []
    missions.map(m => {
      let mass = 0
      if (missionSelected.includes(m.name)) {
        for(let i = 0; i < m.payloads.length; i++) {
          mass = mass + (m.payloads[i]?.payload_mass_kg || 0)
        }}
        return missionsMass.push({name: m.name, mass: mass})
      })

      return missionsMass
  }

  const generateBackgroundColors = (numberOfMissions: number) => {
    let colors = []
    for(let i = 0; i < numberOfMissions; i++) {
      colors.push({name: missionNames[i], color: `#${Math.floor(Math.random()*16777215).toString(16)}`})
    }
    return colors
  }

  const [missions, setMissions] = useState(props.missions)
  const [missionNames, setMissionNames] = useState<string[]>(props.missions.map(m => m.name))
  const [doughnutData, setDoughnutData] = useState<DoughtnutData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        cutout: "",
        radius: 0
      }
    ]
  })

  const getNations = () => {
    let nationList: string[] = []
    missions.map(m => {
      if (!nationList.find(n => n === m.payloads[0]?.nationality))
        nationList.push(m.payloads[0]?.nationality || "")
    })
    return nationList
  }
  const [nations, setNations] = useState<string[]>(getNations())
  const [missionSelected, setMissionSelected] = useState<string[]>(missionNames)
  const [missionSelectedData, setMissionSelectedData] = useState(selectedMissionData())
  const [missionColors, setMissionColors] = useState(generateBackgroundColors(missionSelected.length))
  const updateDoughnutData = () => {
    setDoughnutData({
      labels: missionSelected,
      datasets: [
        {
          data: missionSelectedData.map(m => m.mass),
          backgroundColor: missionColors.map(c => c.color),
          cutout: "90%",
          radius: 100,
        }
      ]
    })
  }
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const [sortedField, setSortedField] = React.useState<keyof typeof missionSelectedData[0]>();
  const [sortDirection, setSortDirection] = React.useState("")
  const [sortedMissions, setSortedMissions] = React.useState(missionSelectedData);
  const requestSort = (fieldToSort: keyof typeof missionSelectedData[0]) => {
    console.log('Hello? sorting?',fieldToSort,sortedField, sortDirection)
    if (!sortedField || fieldToSort !== sortedField) {
      console.log("not sorted so soting withascend?")
      setSortedField(fieldToSort)
      setSortDirection("ascending")
      console.log("not set?", sortedField, sortDirection)

    } else {
      if (sortDirection === "ascending") {
        setSortDirection("descending")
      } else if (sortDirection === "descending") {
        setSortDirection("")
      } else {
        setSortDirection("ascending")
      }
    }
  }

  React.useMemo(() => {
    let tempSort = [...missionSelectedData]
    if (sortedField && sortDirection !== "") {
      tempSort.sort((a, b) => {
        if (a[sortedField] < b[sortedField]) {
          return sortDirection === "ascending" ? -1 : 1;
        }
        if (a[sortedField] > b[sortedField]) {
          return sortDirection === "ascending" ? 1 : -1;
        }
        return 0;
      });
    } else {
      console.log("reset sort")
      tempSort = missionSelectedData
    }
    setSortedMissions(tempSort)
  }, [sortedField, sortDirection])

  useEffect(() => {
    updateDoughnutData()
    }, [])

  return <>
  <div>
    <div className="font-xl font-bold items-center">
      Total Payload Per Mission
    </div>
    <div className="dropdown float-right text-light-blue-600">
      <button className="text-light-blue" onClick={handleOpen}>All nations
      <span>{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
      </button>
      {open ? (
        <ul className="menu">
          {nations.map(nation => (
            <li className="menu-item">
              <button>{nation}</button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
      <div className="grid grid-cols-2">
        <div>
          <Doughnut data={doughnutData} options={options} />
        </div>
        <div>
        <table className="my-16 table-fixed">
          <thead>
            <tr className="text-left text-sm">
              <th onClick={() => requestSort("name")}>
                Mission
                {sortedField === "name" && (sortDirection === "ascending" ? <UpIcon width="15px" height="15px" /> : sortDirection === "descending" ? <DownIcon /> : "")}
              </th>
              <th onClick={() => requestSort("mass")}>
                <div>
                Total Payload Mass 
                  {sortedField === "mass" && (sortDirection === "ascending" ? <UpIcon width="15px" height="15px" /> : sortDirection === "descending" ? <DownIcon /> : "")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMissions.map(mission => (
              <tr className="text-sm">
                <td className="py-2 px-1 border-b">
                <div className="w-48 flex items-center justify-start">
                  <CircleIcon fill={missionColors.find(m => m.name === mission.name)?.color} width="8px" height="8px"/>
                  <div className="pl-2 truncate overflow-ellipsis">
                    {mission.name}
                  </div>
                </div>
                </td>
                <td className="border-b">{mission.mass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</>;
};

export default PayloadCard;
