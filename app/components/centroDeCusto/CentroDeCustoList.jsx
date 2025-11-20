import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputText from "@/components/inputs/InputText";
import NoDataFound from "../Layouts/NoDataFound";
import Radio from "@/components/inputs/Radio";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";

const CentroDeCustoList = ({
    cdPessoaCliente,
    cdEmpresa,
    className,
    contentClass,
    init,
    callBack,
    ...props
}) => {
    const [centroCustoSelected, setCentroCustoSelected] = useState({});
    const [dadosCentroCusto, setDadosCentroCusto] = useState([]);
    const [filter, setFilter] = useState({ data: "" });
    const [ready, setReady] = useState(false);
    const { toast } = useAppContext();

    const setFilterTextCallback = useCallback(
        (id, value) => {
            setFilter((prevFilter) => ({ ...prevFilter, [id]: value }));
        },
        [setFilter]
    );

    const handleCentroCustoSelected = useCallback(
        (centroCusto) => {
            setCentroCustoSelected(centroCusto);
            callBack(centroCusto);
        },
        [setCentroCustoSelected, callBack]
    );

    function getCentroCustoList() {
        axiosInstance
            .get(`centro-custo/list-centro-custo/${cdPessoaCliente}/${cdEmpresa}`)
            .then(function (response) {
                setDadosCentroCusto(response.data);
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
        if (!init) return;
        if (!cdPessoaCliente || !cdEmpresa) return;
        getCentroCustoList();
    }, [init, cdPessoaCliente, cdEmpresa]);

    const dadosCentroCustoFilter = useMemo(() => {
        return dadosCentroCusto.filter((item) =>
            Object.values(item).some(
                (v) => typeof v === "string" && v.toLowerCase().includes(filter.data.toLowerCase())
            )
        );
    }, [filter, dadosCentroCusto]);

    function dataToHtml() {
        if (!dadosCentroCustoFilter) return <NoDataFound />;
        return dadosCentroCustoFilter.map((centroCusto) => {
            return (
                <div
                    key={centroCusto.CD_CENTRO_CUSTO}
                    className={`
                        flex flex-row
                        flex-nowrap
                        text-sm gap-2 py-1
                        hover:bg-blue-100
                        w-full
                        ${
                            centroCusto.CD_CENTRO_CUSTO == centroCustoSelected?.CD_CENTRO_CUSTO
                                ? "bg-blue-200"
                                : "even:bg-white odd:bg-slate-100"
                        }`}
                >
                    <div className="flex w-1/3 px-1">
                        <Radio
                            id={`cargo_${centroCusto.CD_CENTRO_CUSTO}`}
                            label={centroCusto.NM_CENTRO_CUSTO}
                            checked={
                                centroCusto.CD_CENTRO_CUSTO == centroCustoSelected?.CD_CENTRO_CUSTO
                            }
                            onClick={() => {
                                handleCentroCustoSelected(centroCusto);
                            }}
                        />
                    </div>
                    <div className="flex w-1/3 px-1 items-center">
                        {centroCusto.CD_CENTRO_CUSTO || "-"}
                    </div>
                </div>
            );
        });
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
                    <div className="flex w-1/3 p-1">Nome CC</div>
                    <div className="flex w-1/3 p-1">Código CC</div>
                </div>

                <div
                    className={`flex flex-row w-full text-primary font-semibold p-2 items-center justify-center ${
                        !ready ? "" : "hidden"
                    }`}
                >
                    Carregando{" "}
                    <FontAwesomeIcon
                        icon={faSpinner}
                        width="18"
                        height="18"
                        className="animate-spin ml-2"
                    />
                </div>

                <div className={`flex flex-row flex-wrap pb-10 w-full ${contentClass}`}>
                    {dataToHtml()}
                </div>

                <div className="flex flex-row bg-white text-sm text-primary w-full p-0.5">
                    Exibindo {dadosCentroCustoFilter?.length || 0} registros
                </div>
            </div>
        </>
    );
};
export default CentroDeCustoList;
