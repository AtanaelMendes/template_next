import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import InputText from "@/components/inputs/InputText";
import NoDataFound from "../Layouts/NoDataFound";
import Radio from "@/components/inputs/Radio";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { cn } from "@/assets/utils";

const TunosList = ({ cdTipoContratacao, className, contentClass, init, callBack, ...props }) => {
    const [dadosTurnoFilter, setDadosTurnoFilter] = useState([]);
    const [dadosTurno, setDadosTurno] = useState([]);
    const { toast } = useAppContext();
    const [turnoSelected, setTurnoSelected] = useState({});
    const [filter, setFilter] = useState({ data: "" });
    const [ready, setReady] = useState(false);

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter((prevFilter) => ({
                ...prevFilter,
                [id]: value,
            }));
        },
        [setFilter]
    );

    const handleChangeTurnoSelected = useCallback((turno) => {
        callBack(turno);
        setTurnoSelected(turno);
    }, []);

    function getTurnos() {
        axiosInstance
            .get(`turno/turnos-list/${cdTipoContratacao}`)
            .then(function (response) {
                setDadosTurno(response.data);
                setReady(true);
            })
            .catch(function (resp) {
                let error = resp?.response?.data?.error;
                if (Array.isArray(error)) {
                    return toast.error(error.join(" ") || "OOps ocorreu um erro");
                }
                return toast.error(error || "OOps ocorreu um erro");
            });
    }

    useEffect(() => {
        if (dadosTurno) {
            setDadosTurnoFilter(
                dadosTurno.filter((item) =>
                    Object.values(item).some(
                        (v) =>
                            typeof v === "string" &&
                            v.toLowerCase().includes(filter.data.toLowerCase())
                    )
                )
            );
        }
    }, [filter]);

    useEffect(() => {
        setDadosTurnoFilter(dadosTurno);
    }, [dadosTurno]);

    useEffect(() => {
        if (!init) return;
        if (!cdTipoContratacao) return;
        getTurnos();
    }, [init, cdTipoContratacao]);

    function renderTurnos(index, style, data) {
        if (!data) return <NoDataFound />;
        const turno = data[index];
        return (
            <div
                key={turno.CD_TURNO}
                style={style}
                className={cn(
                    `flex flex-row flex-nowrap text-sm gap-2 py-1 hover:bg-blue-100 w-full`,
                    turno.CD_TURNO == turnoSelected?.CD_TURNO
                        ? "bg-blue-200"
                        : "even:bg-white odd:bg-slate-100"
                )}
            >
                <div className="flex items-center w-full">
                    <div className="flex w-3/6 px-1">
                        <Radio
                            id={`cargo_${turno.CD_TURNO}`}
                            label={turno.NM_TURNO}
                            checked={turno.CD_TURNO == turnoSelected?.CD_TURNO}
                            onClick={() => {
                                handleChangeTurnoSelected(turno);
                            }}
                        />
                    </div>
                    <div className="flex w-1/6 px-1 items-center">{turno.CD_TURNO || "-"}</div>
                    <div className="flex w-2/6 items-center px-1">
                        {turno.CD_TURNO_DATASUL || "-"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`flex flex-row flex-wrap relative border border-blue-100 rounded my-2 ${className}`}
            >
                <div className="flex w-full flex-row-reverse p-2">
                    <div className="w-1/3">
                        <InputText
                            id={"data"}
                            clearable={true}
                            placeholder={"Filtrar"}
                            onChange={setFilterTextCallback}
                            value={filter.data}
                        />
                    </div>
                </div>

                <div className="flex flex-row w-full bg-primary text-white font-semibold text-base flex-nowrap">
                    <div className="flex w-3/6 p-1">Turnos</div>
                    <div className="flex w-1/6 p-1">Cód. Turno</div>
                    <div className="flex w-2/6 p-1">Cód. Datasul</div>
                </div>

                <div
                    className={`flex flex-row w-full text-primary font-semibold p-2 items-center justify-center ${
                        !ready ? "" : "hidden"
                    }`}
                >
                    Carregando
                    <FontAwesomeIcon
                        icon={faSpinner}
                        width="18"
                        height="18"
                        className="animate-spin ml-2"
                    />
                </div>

                <div className={`flex flex-row flex-wrap w-full h-[80vh] ${contentClass}`}>
                    <div className="flex-auto">
                        <AutoSizer defaultHeight={500} disableWidth>
                            {({ height }) => (
                                <FixedSizeList
                                    height={height}
                                    itemCount={dadosTurnoFilter.length}
                                    itemSize={60}
                                    itemData={dadosTurnoFilter}
                                    overscanCount={12}
                                >
                                    {({ index, style, data }) => renderTurnos(index, style, data)}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </div>
                </div>

                <div className="flex flex-row bg-white text-sm text-primary w-full p-0.5">
                    Exibindo {dadosTurnoFilter?.length || 0} registros
                </div>
            </div>
        </>
    );
};
export default TunosList;
