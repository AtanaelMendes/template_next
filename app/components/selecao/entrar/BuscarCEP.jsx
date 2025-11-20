import { useEffect, useState, useCallback, useMemo } from 'react';
import InputText from '@/components/inputs/InputText';
import SelectTailwind from 'react-tailwindcss-select';
import axiosInstance from '@/plugins/axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SmallLoading from '../../Layouts/SmallLoading';
import Button from '@/components/buttons/Button';
import { Pagination } from '@/components/Layouts/Pagination';

const BuscarCEP = ({ cepSelecionadoCallBack, cdUfCandidato }) => {
    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [resultadosVisiveis, setResultadosVisiveis] = useState([]);
    const [selectedUF, setSelectedUF] = useState(null);
    const [selectedCidade, setSelectedCidade] = useState(null);
    const [nome, setNome] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filterCep, setFilterCep] = useState({ search: "" });
    const itensPorPagina = 50;

    useEffect(() => {
        axiosInstance.get('/estados/estados-por-pais/1').then(({ data }) => {
            const estadosFormatados = data.map(uf => ({ value: uf.cdUf, label: uf.nmUf }));
            setUfs(estadosFormatados);

            if (cdUfCandidato) {
                const ufSelecionada = estadosFormatados.find(uf => uf.value === cdUfCandidato);
                if (ufSelecionada) setSelectedUF(ufSelecionada);
            }
        });
    }, [cdUfCandidato]);

    useEffect(() => {
        if (selectedUF) {
            axiosInstance.get(`/cidades/cidades-por-estado/${selectedUF.value}/1`)
                .then(({ data }) => setCidades(data.map(c => ({ value: c.nmCidade, label: c.nmCidade }))));
        } else {
            setCidades([]);
        }
    }, [selectedUF]);

    const handleSearchClick = () => {
        if (selectedUF && selectedCidade) {
            setIsLoading(true);
            axiosInstance.post('/endereco/buscar-ceps', {
                nome,
                uf: selectedUF?.value,
                cidade: selectedCidade?.value
            }).then(({ data }) => {
                setResultados(data);
            }).catch(() => toast.error('CEP não encontrado'))
                .finally(() => setIsLoading(false));
        } else {
            toast.warn("Selecione no mínimo o Estado e a Cidade para pesquisar.");
        }
    };

    const selecionarCEP = (cep) => {
        cepSelecionadoCallBack(cep);
        toast.success(`CEP selecionado: ${cep}`);
    };

    const setFilterTextCallback = useCallback((id, value) => {
        setFilterCep(prevState => ({ ...prevState, search: value }));
    }, []);

    const resultadosFiltrados = useMemo(() =>
        resultados.filter((item) =>
            Object.values(item).some((v) =>
                typeof v === "string" && v.toLowerCase().includes(filterCep.search.toLowerCase())
            )
        ),
        [filterCep, resultados]
    );

    const handleKeyDown = (e) => {
        console.log(e.key);
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };   

    return (
        <div className="flex flex-col h-[60vh]">
            <div className="flex-shrink-0 space-y-4 p-2 border-b bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className='block py-1 font-semibold'>Nome do Logradouro</label>
                        <InputText
                            id='nome'
                            value={nome}
                            maxLength={500}
                            placeholder='Digite o nome do logradouro'
                            mask='text'
                            onChange={(id, value) => setNome(value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div>
                        <label className='block py-1 font-semibold'>Estado (UF)</label>
                        <SelectTailwind
                            id='uf'
                            value={selectedUF}
                            onChange={setSelectedUF}
                            options={ufs}
                            isSearchable
                            isClearable
                            placeholder='Escolha o Estado'
                        />
                    </div>
                    <div>
                        <label className='block py-1 font-semibold'>Cidade</label>
                        <SelectTailwind
                            id='cidade'
                            value={selectedCidade}
                            onChange={setSelectedCidade}
                            options={cidades}
                            isSearchable
                            isClearable
                            placeholder='Escolha a Cidade'
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Button
                            buttonType='primary'
                            className='flex w-full items-center justify-center'
                            onClick={handleSearchClick}
                        >
                            <FontAwesomeIcon icon={faSearch} width='16' height='16' className='mr-2' />
                            Pesquisar <SmallLoading active={isLoading} className='ml-2' />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between border-t pt-2 gap-2">
                    <div className="flex-1 min-w-[200px]">
                        <Pagination
                            data={resultadosFiltrados}
                            itemsPerPage={itensPorPagina}
                            callBackChangePage={setResultadosVisiveis}
                            size="sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 min-w-[250px] text-right">
                        <InputText
                            className="p-1.5 text-xs xl:p-2 xl:text-sm w-full md:w-auto"
                            placeholder="Filtrar"
                            clearable={true}
                            onChange={setFilterTextCallback}
                            id="filtro_minhas_vagas"
                        />
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                            Exibindo {resultadosVisiveis.length} de {resultadosFiltrados.length} registros
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {resultadosVisiveis.map((item, index) => (
                    <div key={index} className="p-2 flex justify-between items-center bg-gray-100 rounded-md mt-2">
                        <div className="text-sm xl:text-base">
                            {item.CD_TIPO_LOGRADOURO} {''} {item.NM_CEP} - {item.CD_CEP}, {item.NM_CIDADE}/{item.CD_UF}
                        </div>
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-green-600 cursor-pointer w-4 h-4"
                            onClick={() => selecionarCEP(item.CD_CEP)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuscarCEP;
