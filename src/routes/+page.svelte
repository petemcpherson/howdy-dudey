<script>
    let messages = [];
    let userInput = '';
    let isLoading = false;

    async function sendMessage() {
        if (!userInput.trim()) return;
        
        const userMessage = { role: 'user', content: userInput };
        messages = [...messages, userMessage];
        const currentMessages = [...messages];
        isLoading = true;
        userInput = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: currentMessages }),
            });

            if (!response.ok) throw new Error('Failed to get response');
            
            const assistantMessage = await response.json();
            messages = [...currentMessages, assistantMessage];
        } catch (error) {
            console.error('Error:', error);
            messages = [...currentMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }];
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="min-h-screen bg-amber-50 p-4">
    <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-amber-900 text-center mb-8 font-serif">Howdy Dudey! 🤠</h1>
        
        <div class="bg-[#f4e4bc] rounded-lg p-6 shadow-lg border-2 border-amber-700">
            <div class="space-y-4 mb-4 max-h-[600px] overflow-y-auto">
                {#each messages as message}
                    <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
                        {#if message.role === 'assistant'}
                            <div class="flex flex-col">
                                <span class="text-amber-800 font-bold ml-4 mb-1">Dudey</span>
                                <div class="max-w-[80%] bg-amber-100 text-amber-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-4 shadow-md">
                                    <p class="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        {:else}
                            <div class="max-w-[80%] bg-amber-700 text-amber-50 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl p-4 shadow-md">
                                <p class="whitespace-pre-wrap">{message.content}</p>
                            </div>
                        {/if}
                    </div>
                {/each}
                {#if isLoading}
                    <div class="flex justify-start">
                        <div class="flex flex-col">
                            <span class="text-amber-800 font-bold ml-4 mb-1">Dudey</span>
                            <div class="bg-amber-100 text-amber-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-4 shadow-md max-w-[80%]">
                                <p class="italic">*thinkin' real hard...*</p>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
            
            <form on:submit|preventDefault={sendMessage} class="flex gap-2">
                <input
                    type="text"
                    bind:value={userInput}
                    placeholder="Type yer message here, partner..."
                    class="flex-1 px-4 py-2 rounded-full bg-amber-100 border-2 border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 text-amber-900 placeholder-amber-700/50"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !userInput.trim()}
                    class="px-6 py-2 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                    Send
                </button>
            </form>
        </div>
    </div>
</div>
