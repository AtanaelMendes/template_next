import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import InputText from '@/components/inputs/InputText';
import PillsBadge from '@/components/buttons/PillsBadge'
import DetalhesVaga from "../DetalhesVaga";
import { Caption } from '@/components/Layouts/Typography';
import NoDataFound from "../../../Layouts/NoDataFound";

const TableVagasSelecao = ({ data }) => {
    const [nrVagaOnView, setNrVagaOnView] = useState([]);
    const [filter, setFilter] = useState({ data: "" });
    const [toggleView, setToggleView] = useState(null);

    const setFilterTextCallback = useCallback((id, value) => {
        setFilter(prevFilterVaga => ({
            ...prevFilterVaga,
            [id]: value
        }));
    }, [setFilter]);

    const tableData = useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(v =>
                typeof v === 'string' && v.toLowerCase().includes(filter.data.toLowerCase())
            )
        )
    }, [filter, data]);

    const setViewVaga = useCallback((nr_vaga) => {
        if (!nrVagaOnView.includes(nr_vaga)) {
            setNrVagaOnView([...nrVagaOnView, nr_vaga]);
        }
    });

    const dataToHtml = () => {
        if (!(tableData?.length > 0)) return <NoDataFound />;

        return tableData?.map((row, index) => {
            return (
                <div className="grid grid-cols-12 odd:bg-white even:bg-gray-100 p-2 border-b border-slate-300 text-sm relative" key={`row-${index}`}>
                    <div className="absolute top-[50%] right-2 transform -translate-y-1/2">
                        {row.opcoes}
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Vaga:</Caption>
                            </div>
                            <div className="w-fit inline-flex items-center text-blue-600 cursor-pointer" onClick={() => { setViewVaga(row.nr_vaga) }}>
                                <span className="font-semibold">
                                    {row.nr_vaga}
                                </span>
                                &nbsp;<FontAwesomeIcon icon={faSearch} width="12" height="12" />
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Cargo:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="italic">{row.nm_cargo}</span>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Cliente:</Caption>
                            </div>
                            <div className="w-fit">
                                <span className="font-semibold">{row.nm_apelido_cliente}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Candidatos:</Caption>
                            </div>
                            <div className="w-fit shadow rounded-full">
                                <PillsBadge type={row.qt_candidatos_estagio > 0 ? "primary" : "default"}>{row.qt_candidatos_estagio}</PillsBadge>
                            </div>
                        </div>
                        
                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Status:</Caption>
                            </div>
                            <div className="w-fit shadow rounded-full">
                                <PillsBadge type={row.nm_situacao_vaga == "ABERTA" ? "success" : "default"}>{row.nm_situacao_vaga}</PillsBadge>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap py-0.5">
                            <div className="flex flex-col w-[100px]">
                                <Caption>Dias aberta:</Caption>
                            </div>
                            <div className="w-fit">
                                <PillsBadge type={row.qt_dias_abertura <= 5 ? "success" : "danger"}>{row.qt_dias_abertura}</PillsBadge>
                            </div>
                        </div>
                    </div>

                    <div className={`col-span-12 transition-all duration-500 ease-in-out ${(nrVagaOnView.find(vaga => { return vaga == row.nr_vaga })) ? "h-auto min-h-6" : "h-0"}`}>
                        <DetalhesVaga nrVaga={row.nr_vaga} nmCargo={row.nm_cargo} init={(nrVagaOnView.find(vaga => { return vaga === row.nr_vaga }))} enableEdit toggleView={toggleView} setToggleView={setToggleView} />
                    </div>
                </div>
            );
        });
    }

    return (
        <div className="grid grid-cols-12 bg-white">
            <div className="col-span-12 pb-2 shadow">
                <div className="grid grid-cols-12 py-2">
                    <div className="col-start-9 col-span-4">
                        <InputText placeholder="Filtrar" onChange={setFilterTextCallback} id="data" clearable={true}/>
                    </div>
                </div>
            </div>
            <div className="col-span-12 max-h-[600px] overflow-y-auto">
                {dataToHtml()}
            </div>
        </div>
    );
}
export default TableVagasSelecao;