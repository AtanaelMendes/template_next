import { useAppContext } from "@/context/AppContext";
import { cn, empty } from "@/assets/utils";
import TableCandidatosAlterados from "../tables/TableCandidatosAlterados";
import { useEffect, useState } from "react";

const CandidatosAlterados = ({ candidatos, isCandidatoLoading, refreshTab}) => {
    const [pageView, setPageView] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [toggleView, setToggleView] = useState(null);

    const closeWindow = () => {
        setNrVagaOnView("");
        setNmCargoOnView("");
        setPageView("");
        setMaximizeMinimize(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeWindow();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            id="candidatos-alterados"
            className={cn(`grid grid-cols-12 rounded overflow-y-auto overflow-x-hidden gap-x-2`)}
        >
            <div className={cn(`col-span-12 shadow min-h-[400px] relative md:col-span-12`)}>
                <TableCandidatosAlterados
                    data={candidatos}
                    isCandidatoLoading={isCandidatoLoading}
                    dense={true}
                    active={true}
                    setFilteredData={setFilteredData}
                    filteredData={filteredData}
                    toggleView={toggleView}
                    setToggleView={setToggleView}
                    setPageView={setPageView}
                    pageView={pageView}
                    closeRightWindow={closeWindow}
                    refreshTab={refreshTab}
                />
            </div>
        </div>
    );
};
export default CandidatosAlterados;