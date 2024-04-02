import React, { useState } from "react"
import Button from "@mui/material/Button"

function getLocationHost() {
  return window.location.hostname
}

function getLocationOrigin() {
  return window.location.origin
}

export function Hipra() {
  const [locationHost] = useState(getLocationHost())
  const [locationOrigin] = useState(getLocationOrigin())
  const [hipRaInputText, setHipRaInputText] =
    useState(`Reservoir Temperature, 250.0
Rejection Temperature, 60.0
Formation Porosity, 10.0
Reservoir Area, 55.0
Reservoir Thickness, 0.25
Reservoir Life Cycle, 25
Heat Capacity Of Water, -1
Density Of Water, -1`)
  const [hipRaResult, setHipRaResult] = useState("Run HIP-RA-X to get a result")
  const [errorMessage, setErrorMessage] = useState("")
  const [hipRaLoading, setHipRaLoading] = useState(false)

  const submitHipRa = (event) => {
    event.preventDefault()
    setErrorMessage("")
    setHipRaResult("")

    console.debug("HIP-RA submitted")
    console.debug("HIP-RA input text is:", hipRaInputText)

    let params = {}
    try {
      hipRaInputText.split("\n").forEach((it) => {
        if (it.trim() === "") {
          return
        }

        let kv = it.trim().split(",")
        let name = kv[0].trim()
        let value = kv[1].trim()
        params[name] = value
      })
      console.debug("Parsed params as:", params)
    } catch (e) {
      console.debug("Error parsing params:", e)
      setErrorMessage("Failed to parse parameters")
      return false
    }

    setHipRaLoading(true)
    let apigId = "nmgmk2gu5b"
    if (getLocationHost().indexOf("localhost") !== -1) {
      apigId = "d4nshmdoig"
    }

    fetch(
      `https://${apigId}.execute-api.us-west-2.amazonaws.com/get-hip-ra-result`,
      {
        method: "POST",
        body: JSON.stringify({
          hip_ra_input_parameters: params,
        }),
      }
    ).then((response) => {
      console.debug("Response:", response)
      setHipRaLoading(false)

      response.json().then((responseJson) => {
        console.debug("Response body:\n", responseJson)
        setHipRaLoading(false)

        if (!response.ok) {
          setErrorMessage(`Error: ${responseJson["error"]}`)
        } else {
          setHipRaResult(responseJson["caseReportText"])
        }
      })
    })
  }

  return (
    <div className="mui-container-fluid">
      <div className="mui-panel container">
        <h1 className="mui--text-title">
          <span id="domain-breadcrumb" role="navigation">
            <a href={locationOrigin}>{locationHost}</a> {">"}{" "}
            <a href="../">geothermal</a>
          </span>
          <div className="mui-divider"></div>
          HIP-RA
        </h1>

        <div className="mui--text-body1">
          <p>Heat in Place Resource Assessment:</p>
          <ul>
            <li>
              Muffler, P., and Raffaele Cataldi. "Methods for regional
              assessment of geothermal resources." Geothermics 7.2-4 (1978):
              53-89. (
              <a
                href="https://doi.org/10.1016/0375-6505(78)90002-0"
                target="_blank"
              >
                doi:10.1016/0375-6505(78)90002-0
              </a>
              )
            </li>
            <li>
              Garg, S.K. and J. Combs. 2011. A Reexamination of the USGS
              Volumetric "Heat in Place" Method. Stanford University, 36th
              Workshop on Geothermal Reservoir Engineering; SGP-TR-191, 5 pp. (
              <a
                href="https://pangea.stanford.edu/ERE/pdf/IGAstandard/SGW/2011/garg.pdf"
                target="_blank"
              >
                PDF
              </a>
              )
            </li>
          </ul>
        </div>
      </div>
      <div className="mui-panel container">
        <div className="mui-row">
          <div className="mui-col-lg-6">
            <h3>Parameters</h3>
            <form onSubmit={submitHipRa}>
              <textarea
                placeholder="Parameters go here"
                name="hip_ra_input_parameters"
                rows="13"
                value={hipRaInputText}
                onChange={(e) => setHipRaInputText(e.target.value)}
              ></textarea>
              <Button type="submit" variant="contained">
                Run HIP-RA-X
              </Button>
            </form>
          </div>
          <div id="results-container" className="mui-col-lg-6">
            <h3>Result</h3>
            <span
              id="loading"
              className="loader"
              style={{ display: hipRaLoading ? "block" : "none" }}
            >
              Running...
            </span>
            <pre id="results">{hipRaResult}</pre>
            <div id="error">{errorMessage}</div>
          </div>
        </div>
      </div>
      <div className="mui-panel container">
        <h2>
          <a id="about">About</a>
        </h2>
        <ul>
          <li>
            <a href="https://github.com/NREL/GEOPHIRES-X/tree/main/src/hip_ra_x">
              HIP-RA-X on GitHub
            </a>
          </li>
        </ul>
        <p>
          <a
            target="_blank"
            href="https://github.com/softwareengineerprogrammer/geothermal-ui/issues/new?assignees=&labels=feedback&projects=&template=feedback.md&title=HIP-RA-X+UI+Feedback"
          >
            <b>Click here to submit feedback</b>
          </a>
          . Feedback is welcome and appreciated!
        </p>
      </div>
    </div>
  )
}
